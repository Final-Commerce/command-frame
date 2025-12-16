import { AdjustInventory, AdjustInventoryParams, AdjustInventoryResponse } from "./types";
import { MOCK_PRODUCTS } from "../../demo/database";

export const mockAdjustInventory: AdjustInventory = async (params?: AdjustInventoryParams): Promise<AdjustInventoryResponse> => {
    console.log("[Mock] adjustInventory called", params);
    
    let newStock = 0;
    
    if (params && params.productId) {
        const product = MOCK_PRODUCTS.find(p => p._id === params.productId);
        if (product) {
            // Find variant
            const variant = params.variantId 
                ? product.variants.find(v => v._id === params.variantId) 
                : product.variants[0];
            
            if (variant && variant.inventory && variant.inventory.length > 0) {
                const currentStock = variant.inventory[0].stock || 0;
                const changeAmount = Number(params.amount);
                
                if (params.stockType === 'add') {
                    newStock = currentStock + changeAmount;
                } else if (params.stockType === 'subtract') {
                    newStock = currentStock - changeAmount;
                } else {
                    newStock = changeAmount;
                }
                
                // Update mock DB
                variant.inventory[0].stock = newStock;
            }
        }
    }

    return {
        success: true,
        amount: params?.amount || "0",
        stockType: params?.stockType || "set",
        newStock,
        timestamp: new Date().toISOString()
    };
};

