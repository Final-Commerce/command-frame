import { describe, it, expect, vi, beforeEach } from "vitest";
import { integrationPayment } from "./action";

vi.mock("../../client", () => ({
    commandFrameClient: {
        call: vi.fn()
    }
}));

import { commandFrameClient } from "../../client";

const mockCall = vi.mocked(commandFrameClient.call);

describe("integrationPayment", () => {
    beforeEach(() => {
        mockCall.mockClear();
        mockCall.mockResolvedValue({
            success: true,
            amount: 4250,
            paymentType: "integration",
            order: null,
            timestamp: "2026-05-28T00:00:00.000Z"
        });
    });

    it("delegates to extensionPayment with paymentType integration and forwards every param including emvData and processorFee", async () => {
        await integrationPayment({
            amount: 4250,
            emvData: "EMV_TAG_DATA",
            label: "Visa ****4242",
            extensionId: "stripe-ext",
            processor: "Stripe",
            referenceId: "pi_3Nz",
            processorFee: 125,
            metadata: { brand: "visa" }
        });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("extensionPayment", {
            paymentType: "integration",
            amount: 4250,
            emvData: "EMV_TAG_DATA",
            label: "Visa ****4242",
            extensionId: "stripe-ext",
            processor: "Stripe",
            referenceId: "pi_3Nz",
            processorFee: 125,
            metadata: { brand: "visa" }
        });
    });

    it("accepts the minimal required set (amount + emvData)", async () => {
        await integrationPayment({ amount: 100, emvData: "EMV" });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("extensionPayment", {
            paymentType: "integration",
            amount: 100,
            emvData: "EMV"
        });
    });

    it("typechecks reject calls missing required fields", () => {
        // @ts-expect-error — both required fields missing
        const _bad1: ReturnType<typeof integrationPayment> = integrationPayment({});
        // @ts-expect-error — emvData missing
        const _bad2: ReturnType<typeof integrationPayment> = integrationPayment({ amount: 1 });
        // @ts-expect-error — amount missing
        const _bad3: ReturnType<typeof integrationPayment> = integrationPayment({ emvData: "e" });
        void _bad1; void _bad2; void _bad3;
    });
});
