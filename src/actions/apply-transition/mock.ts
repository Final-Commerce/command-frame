import type { ApplyTransitionParams, ApplyTransitionResponse } from "./types";

/**
 * Mock implementation: applies all transitions except a few known-invalid ones
 * so the demo app can show both successful and blocked responses.
 */
export const applyTransitionMock = (params: ApplyTransitionParams): Promise<ApplyTransitionResponse> => {
    const { to } = params;

    if (to.payment === "refunded" && to.fulfillment === "draft") {
        return Promise.resolve({
            result: {
                allowed: false,
                blockedBy: "financial_invariant" as const,
                guard: "no-refund-in-draft",
                reason: "Cannot refund an order that is still in draft"
            }
        });
    }

    if (to.payment === "paid" && to.fulfillment === "cancelled") {
        return Promise.resolve({
            result: {
                allowed: false,
                blockedBy: "cross_axis_rule" as const,
                guard: "no-pay-cancelled",
                reason: "Cannot mark a cancelled order as paid"
            }
        });
    }

    return Promise.resolve({
        result: { allowed: true },
        from: { payment: "unpaid", fulfillment: "draft" },
        to,
        displayState: `${to.payment} / ${to.fulfillment}`
    });
};
