import { AdjustInventory, AdjustInventoryParams, AdjustInventoryResponse } from './types';
import { MOCK_PRODUCTS } from '../../demo/database';

export const mockAdjustInventory: AdjustInventory = async (
  params?: AdjustInventoryParams,
): Promise<AdjustInventoryResponse> => {
  console.log('[Mock] adjustInventory called', params);

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
