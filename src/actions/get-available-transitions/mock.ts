import type { GetAvailableTransitionsParams, GetAvailableTransitionsResponse } from "./types";

/**
 * Mock implementation: returns a fixed set of plausible transitions
 * so the demo app has data to render.
 */
export const getAvailableTransitionsMock = async (
    _params: GetAvailableTransitionsParams
): Promise<GetAvailableTransitionsResponse> => ({
    transitions: [
        {
            to: { payment: "refunded", fulfillment: "returned" },
            displayLabel: "Full Refund",
            conditions: [{ met: true, description: "Order is paid" }],
        },
        {
            to: { payment: "partially_refunded", fulfillment: "partially_returned" },
            displayLabel: "Partial Refund",
            conditions: [{ met: true, description: "Order is paid" }],
        },
        {
            to: { payment: "voided", fulfillment: "cancelled" },
            displayLabel: "Void Order",
            conditions: [
                { met: true, description: "Order exists" },
                { met: false, description: "No payments captured (mock: skipped)" },
            ],
        },
    ],
});
