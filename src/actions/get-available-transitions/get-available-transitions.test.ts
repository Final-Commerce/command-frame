import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAvailableTransitions } from "./action";
import { getAvailableTransitionsMock } from "./mock";

vi.mock("../../client", () => ({
    commandFrameClient: {
        call: vi.fn()
    }
}));

import { commandFrameClient } from "../../client";

const mockCall = vi.mocked(commandFrameClient.call);

describe("getAvailableTransitions action", () => {
    beforeEach(() => {
        mockCall.mockClear();
    });

    it("calls commandFrameClient with getAvailableTransitions and params", async () => {
        mockCall.mockResolvedValue({ transitions: [] });

        await getAvailableTransitions({ orderId: "order-456" });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("getAvailableTransitions", {
            orderId: "order-456",
        });
    });

    it("returns transitions from the host", async () => {
        const mockTransitions = {
            transitions: [
                {
                    to: { payment: "paid", fulfillment: "fulfilled" },
                    displayLabel: "Complete Payment",
                    conditions: [{ met: true, description: "Cart has items" }],
                },
                {
                    to: { payment: "unpaid", fulfillment: "on_hold" },
                    displayLabel: "Park Order",
                    conditions: [],
                },
            ],
        };
        mockCall.mockResolvedValue(mockTransitions);

        const response = await getAvailableTransitions({ orderId: "order-456" });

        expect(response.transitions).toHaveLength(2);
        expect(response.transitions[0].displayLabel).toBe("Complete Payment");
        expect(response.transitions[1].to.fulfillment).toBe("on_hold");
    });
});

describe("getAvailableTransitionsMock", () => {
    it("returns plausible transitions for demo purposes", async () => {
        const response = await getAvailableTransitionsMock({ orderId: "order-123" });

        expect(response.transitions.length).toBeGreaterThan(0);
        expect(response.transitions[0]).toHaveProperty("to");
        expect(response.transitions[0]).toHaveProperty("displayLabel");
        expect(response.transitions[0]).toHaveProperty("conditions");
    });
});
