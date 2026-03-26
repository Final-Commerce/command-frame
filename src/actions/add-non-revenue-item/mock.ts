import { MOCK_CART } from "../../demo/database";
import { AddNonRevenueItem, AddNonRevenueItemParams, AddNonRevenueItemResponse } from "./types";

export const mockAddNonRevenueItem: AddNonRevenueItem = async (
    params: AddNonRevenueItemParams
): Promise<AddNonRevenueItemResponse> => {
    console.log("[Mock] addNonRevenueItem called", params);

    const amount = Number(params.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("amount must be a positive number");
    }

    const lineId = `nr-mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const refId = params.id;
    const metadata: Record<string, unknown> = {
        ...(params.metadata ?? {}),
        refId
    };
    const row = {
        id: lineId,
        amount,
        applyTaxes: params.applyTaxes === true,
        ...(params.taxTableId ? { taxTableId: params.taxTableId } : {}),
        ...(params.label !== undefined ? { label: params.label } : {}),
        metadata
    };

    if (!MOCK_CART.nonRevenueItems) {
        MOCK_CART.nonRevenueItems = [];
    }
    MOCK_CART.nonRevenueItems.push(row);

    MOCK_CART.total += amount;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;
    MOCK_CART.subtotal = (MOCK_CART.subtotal ?? 0) + amount;

    return {
        success: true,
        id: lineId,
        refId,
        amount,
        label: params.label,
        metadata,
        ...(params.applyTaxes === true ? { applyTaxes: true as const } : {}),
        ...(params.taxTableId ? { taxTableId: params.taxTableId } : {}),
        timestamp: new Date().toISOString()
    };
};
