import { describe, it, expectTypeOf } from "vitest";
import type {
    CFStatePair,
    CFTransitionResult,
    CFFailedCondition,
    CFAvailableTransition,
} from "./order-state";

describe("order-state protocol types", () => {
    it("CFStatePair has payment and fulfillment", () => {
        expectTypeOf<CFStatePair>().toHaveProperty("payment");
        expectTypeOf<CFStatePair>().toHaveProperty("fulfillment");

        const pair: CFStatePair = { payment: "paid", fulfillment: "fulfilled" };
        expectTypeOf(pair.payment).toBeString();
        expectTypeOf(pair.fulfillment).toBeString();
    });

    it("CFTransitionResult has required shape", () => {
        const allowed: CFTransitionResult = { allowed: true };
        expectTypeOf(allowed.allowed).toBeBoolean();

        const blocked: CFTransitionResult = {
            allowed: false,
            blockedBy: "financial_invariant",
            guard: "no-pay-voided",
            reason: "Cannot pay voided order",
            failedConditions: [],
        };
        expectTypeOf(blocked.blockedBy).toEqualTypeOf<
            "financial_invariant" | "cross_axis_rule" | "path" | "condition" | undefined
        >();
    });

    it("CFFailedCondition has field, operator, value", () => {
        const cond: CFFailedCondition = {
            field: "order.total",
            operator: "gt",
            value: 0,
            reason: "Total must be positive",
        };
        expectTypeOf(cond.field).toBeString();
        expectTypeOf(cond.operator).toBeString();
        expectTypeOf(cond.value).toBeUnknown();
    });

    it("CFAvailableTransition has to, displayLabel, conditions", () => {
        const t: CFAvailableTransition = {
            to: { payment: "paid", fulfillment: "fulfilled" },
            displayLabel: "Pay",
            conditions: [{ met: true, description: "Cart has items" }],
        };
        expectTypeOf(t.to).toMatchTypeOf<CFStatePair>();
        expectTypeOf(t.displayLabel).toBeString();
        expectTypeOf(t.conditions).toBeArray();
    });
});
