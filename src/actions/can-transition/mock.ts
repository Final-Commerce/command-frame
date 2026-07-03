import type { CanTransitionParams, CanTransitionResponse } from "./types";

/**
 * Mock implementation: allows all transitions except a few known-invalid ones
 * so the demo app can show both allowed and blocked responses.
 */
export const canTransitionMock = async (
    params: CanTransitionParams
): Promise<CanTransitionResponse> => {
    const to = params.to;

    if (to.payment === "refunded" && to.fulfillment === "draft") {
        return {
            result: {
                allowed: false,
                blockedBy: "financial_invariant",
                guard: "no-refund-in-draft",
                reason: "Cannot refund an order that is still in draft",
            },
        };
    }

    if (to.payment === "paid" && to.fulfillment === "cancelled") {
        return {
            result: {
                allowed: false,
                blockedBy: "cross_axis_rule",
                guard: "no-pay-cancelled",
                reason: "Cannot mark a cancelled order as paid",
            },
        };
    }

    return { result: { allowed: true } };
};
