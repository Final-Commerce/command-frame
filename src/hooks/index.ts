import type { HookFunction, HookRegisterOptions } from "./types";

const DEFAULT_ORIGIN = "*";

function getOrigin(): string {
    return typeof window !== "undefined" ? (window as any).__COMMAND_FRAME_ORIGIN__ ?? DEFAULT_ORIGIN : DEFAULT_ORIGIN;
}

/**
 * Register a session-scoped hook. The callback is serialized and sent to the host (Render);
 * once registered, it runs in the host context even when the extension iframe is not on the current page.
 * The callback must be self-contained (only use event, hostCommands, callCommand).
 * Uses options.hookId as a stable dedup key: re-registering with the same hookId replaces the previous hook.
 */
function register(topic: string, callback: HookFunction, options: HookRegisterOptions): string {
    const hookId = options.hookId;
    const functionBody = callback.toString();

    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage(
            {
                type: "hook-register",
                topic,
                functionBody,
                eventTypes: options.eventTypes,
                hookId
            },
            getOrigin()
        );
    }

    return hookId;
}

/**
 * Unregister a hook by ID. Sends a message to the host to remove the hook.
 */
function unregister(hookId: string): void {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage(
            {
                type: "hook-unregister",
                hookId
            },
            getOrigin()
        );
    }
}

export const hooks = {
    register,
    unregister
};

export type { HookFunction, HookRegisterOptions } from "./types";
