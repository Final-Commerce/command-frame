import type { ApplyTransitionParams, ApplyTransitionResponse } from "./types";

/**
 * Mock implementation: applies all transitions except a known-invalid one
 * so the demo app can show both successful and blocked responses.
 */
export const applyTransitionMock = (params: ApplyTransitionParams): Promise<ApplyTransitionResponse> => {
    const { targetFulfillmentState } = params;

    if (targetFulfillmentState === "cancelled") {
        return Promise.resolve({
            result: {
                allowed: false,
                blockedBy: "condition" as const,
                guard: "no-cancel-open-order",
                reason: "Cannot cancel an order with open items"
            }
        });
    }

    return Promise.resolve({
        result: { allowed: true },
        from: { payment: "unpaid", fulfillment: "draft" },
        to: { payment: "unpaid", fulfillment: targetFulfillmentState },
        displayState: `unpaid / ${targetFulfillmentState}`
    });
};
