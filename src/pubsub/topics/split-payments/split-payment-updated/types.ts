import type { CFSplitPayment } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for split-payment-updated event.
 *
 * Mirrors the host's full split-payment slice. When no split-payment session is
 * active (initial state or after `resetSplitPayment`) the host publishes
 * `{ splitPayment: null }` so subscribers can clear their mirror.
 */
export interface SplitPaymentUpdatedPayload {
    splitPayment: CFSplitPayment | null;
}

/**
 * Typed event for split-payment-updated.
 */
export type SplitPaymentUpdatedEvent = TopicEvent<SplitPaymentUpdatedPayload>;
