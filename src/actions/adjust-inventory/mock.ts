import { AdjustInventory, AdjustInventoryParams, AdjustInventoryResponse } from "./types";

export const mockAdjustInventory: AdjustInventory = async (params?: AdjustInventoryParams): Promise<AdjustInventoryResponse> => {
    console.log("[Mock] adjustInventory called", params);
    
    // Simulate updating inventory
    let newStock = 100;
    if (params?.stockType === 'add') newStock += Number(params.amount);
    if (params?.stockType === 'subtract') newStock -= Number(params.amount);
    if (params?.stockType === 'set') newStock = Number(params.amount);

    return {
        success: true,
        amount: params?.amount || "0",
        stockType: params?.stockType || "set",
        newStock,
        timestamp: new Date().toISOString()
    };
};

