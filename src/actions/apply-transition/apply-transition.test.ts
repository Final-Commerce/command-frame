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
            from: { payment: "unpaid", fulfillment: "pending" },
            to: { payment: "unpaid", fulfillment: "in_progress" },
            displayState: "In progress"
        });

        await applyTransition({
            orderId: "order-123",
            targetFulfillmentState: "in_progress"
        });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("applyTransition", {
            orderId: "order-123",
            targetFulfillmentState: "in_progress"
        });
    });

    it("returns from/to/displayState on a successful transition", async () => {
        mockCall.mockResolvedValue({
            result: { allowed: true },
            from: { payment: "unpaid", fulfillment: "pending" },
            to: { payment: "unpaid", fulfillment: "fulfilled" },
            displayState: "Fulfilled"
        });

        const response = await applyTransition({
            orderId: "order-123",
            targetFulfillmentState: "fulfilled"
        });

        expect(response.result.allowed).toBe(true);
        expect(response.from).toEqual({ payment: "unpaid", fulfillment: "pending" });
        expect(response.to).toEqual({ payment: "unpaid", fulfillment: "fulfilled" });
        expect(response.displayState).toBe("Fulfilled");
    });

    it("returns a blocked result with no state fields when transition is not allowed", async () => {
        mockCall.mockResolvedValue({
            result: {
                allowed: false,
                blockedBy: "condition" as const,
                guard: "no-cancel-open-order",
                reason: "Cannot cancel an order with open items"
            }
        });

        const response = await applyTransition({
            orderId: "order-123",
            targetFulfillmentState: "cancelled"
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("condition");
        expect(response.result.reason).toBe("Cannot cancel an order with open items");
        expect(response.from).toBeUndefined();
        expect(response.to).toBeUndefined();
        expect(response.displayState).toBeUndefined();
    });
});

describe("applyTransitionMock", () => {
    it("applies valid transitions and returns from/to/displayState", async () => {
        const response = await applyTransitionMock({
            orderId: "order-123",
            targetFulfillmentState: "in_progress"
        });

        expect(response.result.allowed).toBe(true);
        expect(response.from).toEqual({ payment: "unpaid", fulfillment: "draft" });
        expect(response.to).toEqual({ payment: "unpaid", fulfillment: "in_progress" });
        expect(response.displayState).toBe("unpaid / in_progress");
    });

    it("blocks the known-invalid cancel transition", async () => {
        const response = await applyTransitionMock({
            orderId: "order-123",
            targetFulfillmentState: "cancelled"
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("condition");
        expect(response.from).toBeUndefined();
        expect(response.to).toBeUndefined();
    });
});
