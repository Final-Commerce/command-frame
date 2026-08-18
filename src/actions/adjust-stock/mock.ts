import { AdjustStock, AdjustStockParams, AdjustStockResponse } from './types';
import { MOCK_PRODUCTS } from '../../demo/database';

// specificAction → baseAction (spec §6.5).
const SPECIFIC_TO_BASE: Record<AdjustStockParams['specificAction'], NonNullable<AdjustStockParams['baseAction']>> = {
  STOCK_RECEIVED: 'ADD',
  RESTOCK_RETURN: 'ADD',
  REFUND_RESTOCK_RETURN: 'ADD',
  DAMAGE: 'REMOVE',
  THEFT: 'REMOVE',
  LOSS: 'REMOVE',
  SALE: 'REMOVE',
  TRANSFER: 'REMOVE',
  REFUND_DAMAGE: 'SKIP',
  INVENTORY_RECOUNT: 'RECOUNT',
  BULK_RECOUNT: 'RECOUNT',
};

export const mockAdjustStock: AdjustStock = async (params: AdjustStockParams): Promise<AdjustStockResponse> => {
  console.log('[Mock] adjustStock called', params);

  const derivedBaseAction = SPECIFIC_TO_BASE[params.specificAction];
  if (params.baseAction && params.baseAction !== derivedBaseAction) {
    throw new Error(
      `adjustStock: baseAction '${params.baseAction}' does not match specificAction '${params.specificAction}' (expected '${derivedBaseAction}')`,
    );
  }
  const baseAction = params.baseAction ?? derivedBaseAction;

  const product = MOCK_PRODUCTS.find((p) => p._id === params.productId);
  const variant = product?.variants.find((v) => v._id === params.variantId);
  const row = variant?.inventory?.find((r) => r.outletId === params.outletId);
  const currentQuantity = row?.stock ?? 0;

  let updatedQuantity: number;
  switch (baseAction) {
    case 'RECOUNT':
      updatedQuantity = params.quantity;
      break;
    case 'SKIP':
      updatedQuantity = currentQuantity;
      break;
    case 'ADD':
    case 'REMOVE':
    default:
      updatedQuantity = currentQuantity + params.quantity;
      break;
  }

  if (row) {
    row.stock = updatedQuantity;
  }

  return {
    success: true,
    updatedQuantity,
    stockChangeId: `mock_stock_change_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
};
