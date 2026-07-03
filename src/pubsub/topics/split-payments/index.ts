/**
 * Split Payments Topic Definition
 * Defines the split-payments topic and its available event types.
 *
 * This topic mirrors render's `activeEntities.splitPayment` Redux slice. The
 * host (render) publishes the full current `CFSplitPayment` (or `null` when
 * reset) on every mutation and on the command-frame handshake so consumers
 * stay in sync without owning the underlying state.
 */

import type { TopicDefinition } from "../../types";

export const splitPaymentsTopic: TopicDefinition = {
    id: "split-payments",
    name: "Split Payments",
    description: "Topic for in-progress split-payment session updates",
    eventTypes: [
        {
            id: "split-payment-updated",
            name: "Split Payment Updated",
            description:
                "Published whenever the host's split-payment slice mutates (partial added, reset, etc.); payload carries the full current slice or null."
        }
    ]
};

export * from "./types";
