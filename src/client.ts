/**
 * Command Frame Client for iframe communication
 * Allows the iframe to call functions on the parent window via postMessage
 */

import { MOCK_REGISTRY } from "./demo/registry";

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

    constructor(options: { timeout?: number; origin?: string; debug?: boolean; mockMode?: boolean } = {}) {
        this.defaultTimeout = options.timeout || 60000;
        this.origin = options.origin || "*";
        this.debug = options.debug ?? false;
        this.useGlobalDebug = options.debug === undefined;
        // Default to provided mockMode or false. Detection happens via getFinalContext.
        this.mockMode = options.mockMode ?? false;

        // Immediate check for standalone environment to enable mock mode synchronously
        // This prevents race conditions where calls happen before async detection finishes
        if (typeof window !== 'undefined' && window.parent === window) {
            this.mockMode = true;
            if (this.isDebugEnabled()) {
                console.log("[ActionsClient] Standalone environment detected (window.parent === window). Mock Mode enabled immediately.");
            }
        } else {
             // Only run async detection if NOT definitely standalone
            this.getFinalContext().then((context) => {
                if (!context) {
                    if (this.isDebugEnabled()) {
                        console.warn("[ActionsClient] Environment detection failed (timeout or error). Switching to Mock Mode.");
                    }
                    this.mockMode = true;
                }
            });
        }

        if (this.isDebugEnabled()) {
            console.log("[ActionsClient] Initialized", {
                origin: this.origin,
                debug: this.isDebugEnabled(),
                mockMode: this.mockMode
            });
        }
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
            const mockHandler = MOCK_REGISTRY[action as keyof typeof MOCK_REGISTRY];
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
    private getFinalContext(): Promise<any> {
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
