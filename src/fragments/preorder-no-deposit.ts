import type { CFStateConfigFragment } from "../common-types/state-fragment";

/**
 * Pre-order fragment — no deposit required.
 *
 * Mirrors preorder-with-deposit but removes the cross-axis rule that gates
 * `on_hold` on payment state. An order can be placed on hold while still
 * `unpaid` — payment is collected later (pay-at-pickup, BOPIS, COD, etc.).
 *
 * State flow:
 *
 *   unpaid|on_hold  →  (cashier collects payment)  →  paid|on_hold
 *                                                           ↓
 *                                              (progress fulfillment)
 *                                                           ↓
 *                                                    paid|in_progress
 *
 * Key difference from preorder-with-deposit:
 *   - No cross-axis rule blocking `on_hold` when unpaid. The cashier can
 *     confirm the pre-order without collecting a deposit first.
 *   - `unpaid|on_hold` is whitelisted as a valid first-save state pair.
 *   - `in_progress` still requires at least a partial payment (you must pay
 *     before the merchant starts fulfilling).
 *
 * Prefix all IDs with your extension id before merging to avoid collisions.
 */
export const preorderNoDepositFragment: CFStateConfigFragment = {
    paymentPaths: [
        {
            from: "unpaid",
            to: "partially_paid",
            conditionSetId: "require-payment-recorded"
        },
        {
            from: "unpaid",
            to: "paid",
            conditionSetId: "require-full-payment"
        },
        {
            from: "partially_paid",
            to: "paid",
            conditionSetId: "require-full-payment"
        }
    ],

    fulfillmentPaths: [
        {
            from: "draft",
            to: "on_hold",
            conditionSetId: "preorder-no-deposit-require-items"
        },
        {
            from: "on_hold",
            to: "cancelled",
            conditionSetId: "preorder-no-deposit-cancel-before-progress"
        }
    ],

    transitionConditions: [
        {
            id: "preorder-no-deposit-require-items",
            label: "Require at least one item to place pre-order",
            groups: [
                {
                    conditions: [
                        {
                            field: "computed.itemCount",
                            operator: "gte",
                            value: 1
                        }
                    ]
                }
            ]
        },
        {
            id: "preorder-no-deposit-cancel-before-progress",
            label: "Can only cancel pre-order before fulfillment begins",
            groups: [
                {
                    conditions: [
                        {
                            field: "computed.fulfilledItemCount",
                            operator: "eq",
                            value: 0
                        }
                    ]
                }
            ]
        },
        {
            id: "require-payment-recorded",
            label: "Require at least one payment before marking partially paid",
            groups: [
                {
                    conditions: [
                        {
                            field: "computed.totalPaid",
                            operator: "gt",
                            value: 0
                        }
                    ]
                }
            ]
        },
        {
            id: "require-full-payment",
            label: "Require full payment before marking as paid",
            groups: [
                {
                    conditions: [
                        {
                            field: "computed.totalPaid",
                            operator: "gte",
                            value: 1
                        },
                        {
                            field: "computed.balance",
                            operator: "lte",
                            value: 0
                        }
                    ]
                }
            ]
        }
    ],

    crossAxisRules: [
        {
            id: "preorder-no-deposit-require-payment-before-confirm",
            label: "Require payment before starting fulfillment",
            description: "Fulfillment cannot move to in_progress unless at least a partial payment has been made",
            enabled: true,
            trigger: {
                axis: "fulfillment",
                to: ["in_progress"]
            },
            requires: {
                axis: "payment",
                states: ["partially_paid", "paid"]
            }
        }
    ],

    validInitialStates: [
        { payment: "unpaid", fulfillment: "on_hold" },
        { payment: "partially_paid", fulfillment: "on_hold" },
        { payment: "paid", fulfillment: "on_hold" }
    ],

    displayStateMap: [
        {
            paymentState: ["unpaid"],
            fulfillmentState: ["on_hold"],
            label: "Pre-Order",
            color: "#6366f1",
            icon: "clock"
        },
        {
            paymentState: ["partially_paid"],
            fulfillmentState: ["on_hold"],
            label: "Pre-Order (Deposit Received)",
            color: "#f59e0b",
            icon: "clock"
        },
        {
            paymentState: ["paid"],
            fulfillmentState: ["on_hold"],
            label: "Pre-Order (Fully Paid)",
            color: "#22c55e",
            icon: "check-circle"
        }
    ]
};
