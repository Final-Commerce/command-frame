import type { GetAvailableTransitionsResponse } from "./types";

/**
 * Mock implementation: returns a fixed set of plausible transitions
 * so the demo app has data to render. Mirrors an UNPAID order under the
 * default (empty cross-axis rules) config: fulfillment can advance without
 * payment (FI-6383), plus the classic park/void moves.
 */
export const getAvailableTransitionsMock = (): GetAvailableTransitionsResponse => ({
    transitions: [
        {
            to: { payment: "unpaid", fulfillment: "in_progress" },
            displayLabel: "Start Preparing",
            conditions: [{ met: true, description: "Order has items" }]
        },
        {
            to: { payment: "unpaid", fulfillment: "fulfilled" },
            displayLabel: "Mark Fulfilled",
            conditions: [{ met: true, description: "Order has items" }]
        },
        {
            to: { payment: "unpaid", fulfillment: "on_hold" },
            displayLabel: "Park Order",
            conditions: [{ met: true, description: "Order is open" }]
        },
        {
            to: { payment: "paid", fulfillment: "fulfilled" },
            displayLabel: "Complete Payment",
            conditions: [{ met: true, description: "Balance due > 0" }]
        },
        {
            to: { payment: "voided", fulfillment: "cancelled" },
            displayLabel: "Void Order",
            conditions: [
                { met: true, description: "Order exists" },
                { met: false, description: "No payments captured (mock: skipped)" }
            ]
        }
    ]
});
