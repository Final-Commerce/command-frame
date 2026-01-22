/**
 * Command Frame Client for iframe communication
 * Allows the iframe to call functions on the parent window via postMessage
 */

export interface PostMessageRequest<T = any> {
    action: string;
    params?: T;
    requestId: string;
}

export interface PostMessageResponse<T = any> {
    requestId: string;
    success: boolean;
    data?: T;
    error?: string;
}

// Define a common mock handler type
export type MockHandler = (params?: any) => Promise<any>;

export class CommandFrameClient {
    private pendingRequests: Map<
        string,
        {
            resolve: (value: any) => void;
            reject: (error: Error) => void;
            timeout: ReturnType<typeof setTimeout>;
        }
    > = new Map();

    private defaultTimeout: number;
    private origin: string;
    private debug: boolean;
    private useGlobalDebug: boolean;
    private mockMode: boolean;
    // Use the specific MockHandler type instead of a generic Record
    private mockRegistry: Record<string, MockHandler>;

    constructor(options: { 
        timeout?: number; 
        origin?: string; 
        debug?: boolean; 
        mockMode?: boolean;
        // Accept any record of handlers as long as they return a Promise
        mockRegistry?: Record<string, MockHandler>;
    } = {}) {
        this.defaultTimeout = options.timeout || 60000;
        this.origin = options.origin || "*";
        this.debug = options.debug ?? false;
        this.useGlobalDebug = options.debug === undefined;
        // Default to provided mockMode or false. Detection happens via getFinalContext.
        this.mockMode = options.mockMode ?? false;
        this.mockRegistry = options.mockRegistry || {};

        // If running standalone (no parent window), force Mock Mode immediately
        // This prevents the 2s delay and ensures immediate response in dev/standalone mode
        if (typeof window !== 'undefined' && (!window.parent || window.parent === window)) {
            if (this.isDebugEnabled()) {
                console.log("[ActionsClient] Standalone mode detected. Enabling Mock Mode immediately.");
            }
            this.mockMode = true;
        }

        if (typeof window !== 'undefined') {
            window.addEventListener("message", this.handleMessage.bind(this));
        }

        // Auto-detect mock mode on initialization
        this.detectContext().then((context) => {
            if (!context) {
                // If context detection fails, we switch to mock mode
                // BUT only if we aren't already forcing mock mode (which happens above if no parent)
                if (this.isDebugEnabled()) {
                    console.warn("[ActionsClient] Environment detection failed (timeout or error). Switching to Mock Mode.");
                }
                this.mockMode = true;
            }
        });

        if (this.isDebugEnabled()) {
            console.log("[ActionsClient] Initialized", {
                origin: this.origin,
                debug: this.isDebugEnabled(),
                mockMode: this.mockMode
            });
        }

        // Return a Proxy to enable dynamic method calls
        // This allows client.getProducts() to map to client.call('getProducts')
        return new Proxy(this, {
            get: (target, prop: string) => {
                // If the property exists on the instance, return it
                if (prop in target) {
                    return (target as any)[prop];
                }
                // Otherwise, assume it's an action name and return a wrapper function
                return (params?: any) => target.call(prop, params);
            }
        });
    }

    private isDebugEnabled(): boolean {
        if (!this.useGlobalDebug) {
            return this.debug;
        }
        return typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true;
    }

    async call<TParams = any, TResponse = any>(action: string, params?: TParams, timeout?: number): Promise<TResponse> {
        // Mock Mode Handler
        if (this.mockMode) {
            if (this.isDebugEnabled()) {
                console.log("[ActionsClient] Mock Call", { action, params });
            }
            const mockHandler = this.mockRegistry[action];
            if (mockHandler) {
                // Simulate async delay
                await new Promise(resolve => setTimeout(resolve, 100));
                try {
                    return await mockHandler(params) as TResponse;
                } catch (error: any) {
                    console.error(`[ActionsClient] Mock Error for ${action}:`, error);
                    throw error;
                }
            } else {
                console.warn(`[ActionsClient] No mock handler found for action: ${action}`);
                throw new Error(`Mock handler not implemented for: ${action}`);
            }
        }

        // Standard PostMessage Handler
        return new Promise((resolve, reject) => {
            const requestId = this.generateRequestId();
            const timeoutMs = timeout || this.defaultTimeout;

            const timeoutHandle = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                const error = new Error(`PostMessage request timeout: ${action} (${timeoutMs}ms)`);
                
                if (this.isDebugEnabled()) {
                    console.error("[ActionsClient] Request timeout", {
                        requestId,
                        action,
                        timeout: timeoutMs
                    });
                }
                reject(error);
            }, timeoutMs);

            this.pendingRequests.set(requestId, {
                resolve,
                reject,
                timeout: timeoutHandle
            });

            const message: PostMessageRequest<TParams> = {
                action,
                params,
                requestId
            };

            if (this.isDebugEnabled()) {
                console.log("[ActionsClient] Sending request", {
                    requestId,
                    action,
                    params,
                    origin: this.origin,
                    timestamp: new Date().toISOString()
                });
            }

            if (typeof window !== 'undefined' && window.parent) {
                window.parent.postMessage(message, this.origin);
            } else {
                clearTimeout(timeoutHandle);
                this.pendingRequests.delete(requestId);
                const error = new Error("No parent window found. This app must run in an iframe.");
                if (this.isDebugEnabled()) {
                    console.error("[ActionsClient] No parent window", error);
                }
                reject(error);
            }
        });
    }

    // Private check to determine environment
    private detectContext(): Promise<any> {
        return new Promise((resolve) => {
            if (typeof window === 'undefined' || !window.parent || window.parent === window) return resolve(null);

            const requestId = this.generateRequestId();
            const timeout = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                resolve(null);
            }, 2000);

            this.pendingRequests.set(requestId, {
                resolve: (val) => { clearTimeout(timeout); resolve(val); },
                reject: () => { clearTimeout(timeout); resolve(null); },
                timeout
            });

            try {
                window.parent.postMessage({ action: "getFinalContext", requestId }, this.origin);
            } catch {
                clearTimeout(timeout);
                this.pendingRequests.delete(requestId);
                resolve(null);
            }
        });
    }

    private handleMessage(event: MessageEvent<PostMessageResponse>): void {
        if (this.isDebugEnabled()) {
            console.log("[ActionsClient] Received message", {
                origin: event.origin,
                data: event.data,
                timestamp: new Date().toISOString()
            });
        }

        if (this.origin !== "*" && event.origin !== this.origin) {
            if (this.isDebugEnabled()) {
                console.warn("[ActionsClient] Origin mismatch", {
                    expected: this.origin,
                    received: event.origin
                });
            }
            return;
        }

        const response = event.data;

        if (response && response.requestId && this.pendingRequests.has(response.requestId)) {
            const { resolve, reject, timeout } = this.pendingRequests.get(response.requestId)!;

            clearTimeout(timeout);
            this.pendingRequests.delete(response.requestId);

            if (this.isDebugEnabled()) {
                console.log("[ActionsClient] Response received", {
                    requestId: response.requestId,
                    success: response.success,
                    data: response.data,
                    error: response.error
                });
            }

            if (response.success) {
                resolve(response.data);
            } else {
                const error = new Error(response.error || "Unknown error occurred");
                if (this.isDebugEnabled()) {
                    console.error("[ActionsClient] Request failed", {
                        requestId: response.requestId,
                        error: error.message
                    });
                }
                reject(error);
            }
        } else if (this.isDebugEnabled() && response && response.requestId) {
            console.warn("[ActionsClient] Unmatched response", {
                requestId: response.requestId,
                pendingRequests: Array.from(this.pendingRequests.keys())
            });
        }
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    destroy(): void {
        this.pendingRequests.forEach(({ reject, timeout }) => {
            clearTimeout(timeout);
            reject(new Error("CommandFrameClient destroyed"));
        });
        this.pendingRequests.clear();
        if (typeof window !== 'undefined') {
            window.removeEventListener("message", this.handleMessage.bind(this));
        }
    }
}

// Singleton instance
export const commandFrameClient = new CommandFrameClient({
    debug: typeof window !== "undefined" && (window as any).__POSTMESSAGE_DEBUG__ === true
});
