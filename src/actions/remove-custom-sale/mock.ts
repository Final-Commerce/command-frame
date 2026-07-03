import { RemoveCustomSale, RemoveCustomSaleParams, RemoveCustomSaleResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveCustomSale: RemoveCustomSale = (params: RemoveCustomSaleParams): Promise<RemoveCustomSaleResponse> => {
    console.log("[Mock] removeCustomSale called", params);

    if (!params?.id) {
        throw new Error("id is required");
    }

    const { id } = params;
    const sales = MOCK_CART.customSales ?? [];
    const index = sales.findIndex(s => s.id === id);

    if (index === -1) {
        throw new Error(`Custom sale with id ${id} not found`);
    }

    const sale = sales[index];

    // Remove from cart
    sales.splice(index, 1);

    // Recalculate totals
    const lineTotal = sale.price * sale.quantity;
    MOCK_CART.subtotal -= lineTotal;
    MOCK_CART.total -= lineTotal;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish custom-sale-removed event so cart subscribers refresh
    mockPublishEvent("cart", "custom-sale-removed", { customSale: sale, id });

    return Promise.resolve({
        success: true,
        id,
        timestamp: new Date().toISOString()
    });
};
