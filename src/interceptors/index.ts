import { commandFrameClient } from "../client";
import type {
    InterceptorFunction,
    InterceptorPoint,
    InterceptorRegisterOptions,
    InterceptorReturn,
    InterceptorOverlayContext
} from "./types";

const DEFAULT_ORIGIN = "*";
function getOrigin(): string {
    return typeof window !== "undefined" ? (window as any).__COMMAND_FRAME_ORIGIN__ ?? DEFAULT_ORIGIN : DEFAULT_ORIGIN;
}

let overlayId: string | null = null;
let overlayContext: InterceptorOverlayContext | null = null;
let overlayHandler: ((ctx: InterceptorOverlayContext) => void) | null = null;

if (typeof window !== "undefined") {
    window.addEventListener("message", (event: MessageEvent) => {
        const data = event.data;
        if (data && data.type === "interceptor-overlay-init" && typeof data.overlayId === "string") {
            overlayId = data.overlayId;
            overlayContext = { point: data.point, payload: data.payload };
            if (overlayHandler) overlayHandler(overlayContext);
        }
    });
}

/** Register a session-scoped interceptor for a named point. Callback is serialized to the host. */
function register(point: InterceptorPoint, callback: InterceptorFunction, options: InterceptorRegisterOptions): string {
    const interceptorId = options.interceptorId;
    const functionBody = callback.toString();
    if (typeof window !== "undefined" && window.top && window.top !== window) {
        window.top.postMessage(
            { type: "interceptor-register", point, functionBody, interceptorId, timeoutMs: options.timeoutMs },
            getOrigin()
        );
    }
    return interceptorId;
}

function unregister(interceptorId: string): void {
    if (typeof window !== "undefined" && window.top && window.top !== window) {
        window.top.postMessage({ type: "interceptor-unregister", interceptorId }, getOrigin());
    }
}

/** Register a handler invoked when this iframe is opened as an overlay by the host. */
function onOverlay(handler: (ctx: InterceptorOverlayContext) => void): void {
    overlayHandler = handler;
    if (overlayContext) handler(overlayContext);
}

async function report(result: InterceptorReturn): Promise<void> {
    if (!overlayId) {
        console.warn("[interceptors] report called outside an overlay context — ignored");
        return;
    }
    await commandFrameClient.call("resolveExtensionOverlay", { overlayId, result });
}

/** Continue the gated flow, merging `data` into the flow payload. */
function resolve(data: Record<string, any>): Promise<void> { return report(data); }
/** Continue the gated flow with no data. */
function proceed(): Promise<void> { return report(true); }
/** Stop the gated flow. */
function cancel(): Promise<void> { return report(false); }

export const interceptors = { register, unregister, onOverlay, resolve, proceed, cancel };

export type {
    InterceptorFunction, InterceptorPoint, InterceptorRegisterOptions,
    InterceptorReturn, InterceptorOverlayContext, InterceptorHostCommands
} from "./types";
