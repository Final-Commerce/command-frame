import { CFActiveCustomSales } from "../../CommonTypes";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";
import { AddCustomSale, AddCustomSaleParams, AddCustomSaleResponse } from "./types";

export const mockAddCustomSale: AddCustomSale = (params?: AddCustomSaleParams): Promise<AddCustomSaleResponse> => {
    console.log("[Mock] addCustomSale called", params);

    if (!params) throw new Error("Params required");

    // Simple mock ID generation
    const mockId = "sale_" + Math.random().toString(36).substr(2, 9);
    // Mirror render: the flow sends raw dollars ($4); render does toMinorUnits.
    // MOCK_CART tracks minor units, so convert here too.
    const minorFactor = 10 ** (MOCK_CART.minorUnits ?? 2);
    const price = Math.round(Number(params.price) * minorFactor);

    const quantityRaw = params.quantity ?? 1;
    const quantity = typeof quantityRaw === "string" ? parseInt(quantityRaw, 10) : quantityRaw;
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("quantity must be a positive integer");
    }

    const customSale: CFActiveCustomSales = {
        id: mockId,
        name: params.label,
        price: price,
        quantity: quantity,
        applyTaxes: params.applyTaxes ?? false,
        taxTableId: params.taxTableId
    };

    if (!MOCK_CART.customSales) {
        MOCK_CART.customSales = [];
    }

    MOCK_CART.customSales.push(customSale);

    // Update Cart Totals
    MOCK_CART.subtotal += price * quantity;
    MOCK_CART.total += price * quantity;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish custom-sale-added event so cart subscribers refresh
    mockPublishEvent("cart", "custom-sale-added", { customSale });

    return Promise.resolve({
        success: true,
        customSaleId: mockId,
        label: params.label,
        price: price,
        quantity: quantity,
        applyTaxes: params.applyTaxes ?? false,
        timestamp: new Date().toISOString()
    });
};
