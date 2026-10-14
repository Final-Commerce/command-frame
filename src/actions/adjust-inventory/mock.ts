import { AdjustInventory, AdjustInventoryParams, AdjustInventoryResponse, ManualStockReason } from './types';
import { MOCK_PRODUCTS } from '../../demo/database';

// Same rules and messages as the kaching handler.
const STOCK_TYPE_BY_REASON: Record<ManualStockReason, AdjustInventoryParams['stockType']> = {
  STOCK_RECEIVED: 'add',
  RESTOCK_RETURN: 'add',
  DAMAGE: 'subtract',
  THEFT: 'subtract',
  LOSS: 'subtract',
  INVENTORY_RECOUNT: 'set',
};

export const mockAdjustInventory: AdjustInventory = async (
  params?: AdjustInventoryParams,
): Promise<AdjustInventoryResponse> => {
  console.log('[Mock] adjustInventory called', params);

  if (params?.specificAction != null) {
    const { specificAction, stockType, customActionId } = params;
    if (customActionId) throw new Error('Pass either customActionId or specificAction, not both');
    const reasonStockType = STOCK_TYPE_BY_REASON[specificAction];
    if (!reasonStockType) throw new Error(`Unknown specificAction: ${specificAction}`);
    if (reasonStockType !== stockType) {
      throw new Error(`specificAction ${specificAction} requires stockType '${reasonStockType}', got '${stockType}'`);
    }
  }

  let newStock = 0;

  // Real handler keys off variantId (falling back to the active product's
  // variant); mirror that here by finding the owning product for the variant.
  if (params && params.variantId) {
    const variantId = params.variantId;
    let variant;
    for (const product of MOCK_PRODUCTS) {
      const match = product.variants.find((v) => v._id === variantId);
      if (match) {
        variant = match;
        break;
      }
    }

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

  return {
    success: true,
    amount: params?.amount || '0',
    stockType: params?.stockType || 'set',
    newStock,
    timestamp: new Date().toISOString(),
  };
};
