import type { PostMessageResponse } from "../../client";
import { EXTENSION_REFUND_REQUEST_ACTION } from "./constants";
import type { ExtensionRefundParams, ExtensionRefundResponse } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

/**
 * Install a message listener in the **extension iframe** so the host can request refunds.
 * Validates `event.source === window.top` before handling.
 *
 * Replies with {@link PostMessageResponse}, using `event.origin` as the target origin when posting back to the host.
 *
 * @param handler - Perform the extension-side refund (API call, etc.)
 * @returns Unsubscribe function
 */
export function installExtensionRefundListener(
    handler: (params: ExtensionRefundParams) => Promise<ExtensionRefundResponse>
): () => void {
    const onMessage = async (event: MessageEvent): Promise<void> => {
        const raw = event.data;
        if (!isRecord(raw) || raw.action !== EXTENSION_REFUND_REQUEST_ACTION) {
            return;
        }
        const requestId = raw.requestId;
        if (typeof requestId !== "string") {
            return;
        }
        if (event.source !== window.top || !event.source) {
            return;
        }

        const source = event.source as Window;
        const replyOrigin = typeof event.origin === "string" ? event.origin : "*";
        const params = raw.params as ExtensionRefundParams | undefined;

        try {
            if (!params || typeof params.paymentType !== "string" || typeof params.amount !== "number" || typeof params.saleId !== "string") {
                const errPayload: PostMessageResponse<never> = {
                    requestId,
                    success: false,
                    error: "Invalid extension refund params"
                };
                source.postMessage(errPayload, replyOrigin);
                return;
            }

            const result = await handler(params);
            const payload: PostMessageResponse<ExtensionRefundResponse> = {
                requestId,
                success: true,
                data: result
            };
            source.postMessage(payload, replyOrigin);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            const errPayload: PostMessageResponse<never> = {
                requestId,
                success: false,
                error: message
            };
            source.postMessage(errPayload, replyOrigin);
        }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
}
