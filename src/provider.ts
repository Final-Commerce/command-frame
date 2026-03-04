import type { PostMessageRequest, PostMessageResponse } from "./client";

export type ActionHandler<TParams = any, TResponse = any> = (params: TParams) => Promise<TResponse> | TResponse;
export type ActionHandlers = Map<string, ActionHandler>;

export class CommandFrameProvider<TActions extends object = any> {
    private handlers: ActionHandlers = new Map();
    private origin: string;
    private isWildcardPattern: boolean;
    private debug: boolean;
    private destroyed: boolean = false;
    private boundHandleMessage: (event: MessageEvent<PostMessageRequest>) => void;

    constructor(actions?: TActions, options: { origin?: string; debug?: boolean } = {}) {
        this.origin = options.origin || "*";
        this.debug = options.debug || false;
        this.isWildcardPattern = this.origin !== "*" && this.origin.includes("*");

        this.boundHandleMessage = this.handleMessage.bind(this);

        if (typeof window !== "undefined") {
            window.addEventListener("message", this.boundHandleMessage);
        }

        if (actions) {
            (Object.keys(actions) as Array<keyof TActions & string>).forEach((actionName) => {
                const handler = (actions as any)[actionName];
                if (typeof handler === "function") {
                    this.register(actionName, handler);
                }
            });
        }

        if (this.debug) {
            console.log("[CommandFrameProvider] Initialized", {
                origin: this.origin,
                debug: this.debug
            });
        }
    }

    /**
     * Supports "*" (allow all), exact match, and wildcard subdomain
     * patterns like "https://*.example.com".
     */
    private isOriginAllowed(eventOrigin: string): boolean {
        if (this.origin === "*") return true;
        if (!this.isWildcardPattern) return eventOrigin === this.origin;

        const wildcardIndex = this.origin.indexOf("*.");
        const prefix = this.origin.slice(0, wildcardIndex);
        const suffix = this.origin.slice(wildcardIndex + 1);
        return (
            eventOrigin.startsWith(prefix) &&
            eventOrigin.endsWith(suffix) &&
            eventOrigin.length > prefix.length + suffix.length
        );
    }

    register<TParams = any, TResponse = any>(action: string, handler: ActionHandler<TParams, TResponse>): void {
        if (this.destroyed) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Cannot register action after destruction", { action });
            }
            return;
        }

        this.handlers.set(action, handler);

        if (this.debug) {
            console.log("[CommandFrameProvider] Registered action", { action });
        }
    }

    unregister(action: string): void {
        if (this.destroyed) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Cannot unregister action after destruction", { action });
            }
            return;
        }

        this.handlers.delete(action);

        if (this.debug) {
            console.log("[CommandFrameProvider] Unregistered action", { action });
        }
    }

    private async handleMessage(event: MessageEvent<PostMessageRequest>): Promise<void> {
        // Ignore messages after destruction
        if (this.destroyed) {
            return;
        }

        const request = event.data;
        if (!request || typeof request !== "object" || !("action" in request)) {
            return;
        }

        if (!this.isOriginAllowed(event.origin)) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Origin mismatch", {
                    expected: this.origin,
                    received: event.origin
                });
            }
            return;
        }

        const targetOrigin = this.isWildcardPattern ? event.origin : this.origin;

        if (!request.action || !request.requestId) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Invalid request format", {
                    data: event.data,
                    origin: event.origin
                });
            }
            return;
        }

        if (this.debug) {
            console.log("[CommandFrameProvider] Received request", {
                origin: event.origin,
                action: request.action,
                requestId: request.requestId,
                timestamp: new Date().toISOString()
            });
        }

        const handler = this.handlers.get(request.action);

        if (!handler) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Unknown action", { action: request.action });
            }

            // Only send response if source window is still available
            if (event.source && event.source !== window) {
                this.sendResponse(event.source as Window, request.requestId, {
                    success: false,
                    error: `Unknown action: ${request.action}`
                }, targetOrigin);
            }
            return;
        }

        try {
            const result = await handler(request.params);

            // Only send response if source window is still available
            if (event.source && event.source !== window) {
                this.sendResponse(event.source as Window, request.requestId, {
                    success: true,
                    data: result
                }, targetOrigin);

                if (this.debug) {
                    console.log("[CommandFrameProvider] Action executed", {
                        action: request.action,
                        requestId: request.requestId
                    });
                }
            } else if (this.debug) {
                console.warn("[CommandFrameProvider] Cannot send response - source window unavailable", {
                    action: request.action,
                    requestId: request.requestId
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

            // Only send response if source window is still available
            if (event.source && event.source !== window) {
                this.sendResponse(event.source as Window, request.requestId, {
                    success: false,
                    error: errorMessage
                }, targetOrigin);

                if (this.debug) {
                    console.error("[CommandFrameProvider] Action failed", {
                        action: request.action,
                        requestId: request.requestId,
                        error: errorMessage
                    });
                }
            } else if (this.debug) {
                console.warn("[CommandFrameProvider] Cannot send error response - source window unavailable", {
                    action: request.action,
                    requestId: request.requestId,
                    error: errorMessage
                });
            }
        }
    }

    private sendResponse(target: Window, requestId: string, response: Omit<PostMessageResponse, "requestId">, targetOrigin: string): void {
        const message: PostMessageResponse = {
            requestId,
            ...response
        };

        if (this.debug) {
            console.log("[CommandFrameProvider] Sending response", {
                requestId,
                success: response.success,
                targetOrigin
            });
        }

        target.postMessage(message, targetOrigin);
    }

    destroy(): void {
        if (this.destroyed) {
            if (this.debug) {
                console.warn("[CommandFrameProvider] Already destroyed");
            }
            return;
        }

        this.destroyed = true;
        this.handlers.clear();

        if (typeof window !== "undefined") {
            window.removeEventListener("message", this.boundHandleMessage);
        }

        if (this.debug) {
            console.log("[CommandFrameProvider] Destroyed");
        }
    }

    isDestroyed(): boolean {
        return this.destroyed;
    }
}

