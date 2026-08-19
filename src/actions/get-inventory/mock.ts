import { MOCK_PRODUCTS } from '../../demo/database';
import { CFInventoryRow, GetInventory, GetInventoryParams, GetInventoryResponse } from './types';

export const mockGetInventory: GetInventory = async (params: GetInventoryParams): Promise<GetInventoryResponse> => {
  console.log('[Mock] getInventory called', params);

  // Derive rows from the mock catalog's variant inventory so writes made by
  // createProductWithVariants / updateProductBundle / adjustStock round-trip.
  const product = MOCK_PRODUCTS.find((p) => p._id === params.productId);
  const rows: CFInventoryRow[] = (product?.variants || [])
    .filter((v) => !params.variantId || v._id === params.variantId)
    .flatMap((v) =>
      (v.inventory || [])
        .filter((r) => !params.outletId || r.outletId === params.outletId)
        .map((r) => ({
          productId: params.productId,
          variantId: v._id,
          outletId: r.outletId,
          quantity: r.stock ?? 0,
          manageStock: v.manageStock,
          isDeleted: v.isDeleted,
        })),
    );

  return {
    success: true,
    rows,
    timestamp: new Date().toISOString(),
  };
};
