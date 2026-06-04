import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyTransition } from "./action";
import { applyTransitionMock } from "./mock";

vi.mock("../../client", () => ({
    commandFrameClient: {
        call: vi.fn()
    }
}));

import { commandFrameClient } from "../../client";

const mockCall = vi.mocked(commandFrameClient).call;

describe("applyTransition action", () => {
    beforeEach(() => {
        mockCall.mockClear();
    });

    it("calls commandFrameClient with applyTransition and params", async () => {
        mockCall.mockResolvedValue({
            result: { allowed: true },
            from: { payment: "unpaid", fulfillment: "draft" },
            to: { payment: "paid", fulfillment: "fulfilled" },
            displayState: "Paid"
        });

        await applyTransition({
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" }
        });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("applyTransition", {
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" }
        });
    });

    it("returns from/to/displayState on a successful transition", async () => {
        mockCall.mockResolvedValue({
            result: { allowed: true },
            from: { payment: "unpaid", fulfillment: "draft" },
            to: { payment: "paid", fulfillment: "fulfilled" },
            displayState: "Paid"
        });

        const response = await applyTransition({
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" }
        });

        expect(response.result.allowed).toBe(true);
        expect(response.from).toEqual({ payment: "unpaid", fulfillment: "draft" });
        expect(response.to).toEqual({ payment: "paid", fulfillment: "fulfilled" });
        expect(response.displayState).toBe("Paid");
    });

    it("returns a blocked result with no state fields when transition is not allowed", async () => {
        mockCall.mockResolvedValue({
            result: {
                allowed: false,
                blockedBy: "financial_invariant" as const,
                guard: "no-refund-in-draft",
                reason: "Cannot refund an order that is still in draft"
            }
        });

        const response = await applyTransition({
            orderId: "order-123",
            to: { payment: "refunded", fulfillment: "draft" }
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("financial_invariant");
        expect(response.result.reason).toBe("Cannot refund an order that is still in draft");
        expect(response.from).toBeUndefined();
        expect(response.to).toBeUndefined();
        expect(response.displayState).toBeUndefined();
    });
});

describe("applyTransitionMock", () => {
    it("applies valid transitions and returns from/to/displayState", async () => {
        const response = await applyTransitionMock({
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" }
        });

        expect(response.result.allowed).toBe(true);
        expect(response.from).toEqual({ payment: "unpaid", fulfillment: "draft" });
        expect(response.to).toEqual({ payment: "paid", fulfillment: "fulfilled" });
        expect(response.displayState).toBe("paid / fulfilled");
    });

    it("blocks financial_invariant violations", async () => {
        const response = await applyTransitionMock({
            orderId: "order-123",
            to: { payment: "refunded", fulfillment: "draft" }
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("financial_invariant");
        expect(response.from).toBeUndefined();
        expect(response.to).toBeUndefined();
    });

    it("blocks cross_axis_rule violations", async () => {
        const response = await applyTransitionMock({
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "cancelled" }
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("cross_axis_rule");
        expect(response.from).toBeUndefined();
        expect(response.to).toBeUndefined();
    });
});
