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
        const emvData = { brand: "Visa", cardholderName: "Jane Doe", cardNumberLast4: "4242", expiryDate: "12/26", issuer: "Chase", country: "US" };
        await integrationPayment({
            amount: 4250,
            emvData,
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
            emvData,
            label: "Visa ****4242",
            extensionId: "stripe-ext",
            processor: "Stripe",
            referenceId: "pi_3Nz",
            processorFee: 125,
            metadata: { brand: "visa" }
        });
    });

    it("accepts the minimal required set (amount + empty emvData)", async () => {
        await integrationPayment({ amount: 100, emvData: {} });

        expect(mockCall).toHaveBeenCalledTimes(1);
        expect(mockCall).toHaveBeenCalledWith("extensionPayment", {
            paymentType: "integration",
            amount: 100,
            emvData: {}
        });
    });

    it("typechecks reject calls missing required fields", () => {
        // @ts-expect-error — both required fields missing
        const _bad1: ReturnType<typeof integrationPayment> = integrationPayment({});
        // @ts-expect-error — emvData missing
        const _bad2: ReturnType<typeof integrationPayment> = integrationPayment({ amount: 1 });
        // @ts-expect-error — amount missing
        const _bad3: ReturnType<typeof integrationPayment> = integrationPayment({ emvData: {} });
        // @ts-expect-error — emvData must be an object, not a string
        const _bad4: ReturnType<typeof integrationPayment> = integrationPayment({ amount: 1, emvData: "EMV" });
        // @ts-expect-error — unknown emvData field
        const _bad5: ReturnType<typeof integrationPayment> = integrationPayment({ amount: 1, emvData: { madeUpField: "x" } });
        void _bad1; void _bad2; void _bad3; void _bad4; void _bad5;
    });
});
