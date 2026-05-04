import { describe, it, expect, vi, beforeEach } from "vitest";
import { canTransition } from "./action";
import { canTransitionMock } from "./mock";

vi.mock("../../client", () => ({
    commandFrameClient: {
        call: vi.fn()
    }
}));

import { commandFrameClient } from "../../client";

const mockCall = vi.mocked(commandFrameClient.call);

describe("canTransition action", () => {
    beforeEach(() => {
        mockCall.mockClear();
    });

    it("calls commandFrameClient with canTransition and params", async () => {
        mockCall.mockResolvedValue({ result: { allowed: true } });

        await canTransition({
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" },
        });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("canTransition", {
            orderId: "order-123",
            to: { payment: "paid", fulfillment: "fulfilled" },
        });
    });

    it("returns the transition result from the host", async () => {
        const blockedResult = {
            result: {
                allowed: false,
                blockedBy: "financial_invariant" as const,
                guard: "no-refund-exceeds-paid",
                reason: "Refund amount exceeds paid amount",
            },
        };
        mockCall.mockResolvedValue(blockedResult);

        const response = await canTransition({
            to: { payment: "refunded", fulfillment: "returned" },
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("financial_invariant");
        expect(response.result.reason).toBe("Refund amount exceeds paid amount");
    });

    it("supports omitting orderId for new-order evaluation", async () => {
        mockCall.mockResolvedValue({ result: { allowed: true } });

        await canTransition({
            to: { payment: "unpaid", fulfillment: "on_hold" },
        });

        expect(mockCall).toHaveBeenCalledWith("canTransition", {
            to: { payment: "unpaid", fulfillment: "on_hold" },
        });
    });
});

describe("canTransitionMock", () => {
    it("allows valid transitions", async () => {
        const response = await canTransitionMock({
            to: { payment: "paid", fulfillment: "fulfilled" },
        });

        expect(response.result.allowed).toBe(true);
    });

    it("blocks known-invalid transitions", async () => {
        const response = await canTransitionMock({
            to: { payment: "refunded", fulfillment: "draft" },
        });

        expect(response.result.allowed).toBe(false);
        expect(response.result.blockedBy).toBe("financial_invariant");
    });
});
