import { describe, it, expect, vi, beforeEach } from "vitest";
import { extensionPayment } from "./action";
import { redeemPayment } from "../redeem-payment/action";

vi.mock("../../client", () => ({
    commandFrameClient: {
        call: vi.fn()
    }
}));

import { commandFrameClient } from "../../client";

const mockCall = vi.mocked(commandFrameClient.call);

describe("extensionPayment", () => {
    beforeEach(() => {
        mockCall.mockClear();
        mockCall.mockResolvedValue({
            success: true,
            amount: 10,
            paymentType: "wallet",
            order: null,
            timestamp: "2020-01-01T00:00:00.000Z"
        });
    });

    it("calls commandFrameClient with wire action extensionPayment and params", async () => {
        await extensionPayment({ paymentType: "wallet", amount: 5, processor: "points" });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("extensionPayment", {
            paymentType: "wallet",
            amount: 5,
            processor: "points"
        });
    });
});

describe("redeemPayment", () => {
    beforeEach(() => {
        mockCall.mockClear();
        mockCall.mockResolvedValue({
            success: true,
            amount: 25,
            paymentType: "redeem",
            order: null,
            timestamp: "2020-01-01T00:00:00.000Z"
        });
    });

    it("delegates to extensionPayment with paymentType redeem", async () => {
        await redeemPayment({ amount: 25, processor: "giftCard", label: "Card ****" });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("extensionPayment", {
            paymentType: "redeem",
            amount: 25,
            processor: "giftCard",
            label: "Card ****"
        });
    });
});
