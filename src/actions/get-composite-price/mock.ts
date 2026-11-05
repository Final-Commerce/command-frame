import { GetCompositePrice, GetCompositePriceParams, GetCompositePriceResponse } from './types';
import {
  MOCK_CART,
  MOCK_PRODUCTS,
  buildModifierRows,
  mockCompositeAtOutlet,
  mockCompositeStockRefusal,
  mockHiddenProductIds,
} from '../../demo/database';
import {
  compositePicksRefusal,
  mockCompositeLine,
  mockFullPartIds,
  mockNeedsDateRefusal,
  mockPicksStillNeeded,
} from '../add-product-to-cart/mock';

// The same line the mock addProductToCart builds, priced for `quantity` composites and added to nothing.
export const mockGetCompositePrice: GetCompositePrice = async (
  params: GetCompositePriceParams,
): Promise<GetCompositePriceResponse> => {
  console.log('[Mock] getCompositePrice called', params);
  const timestamp = new Date().toISOString();
  const product = MOCK_PRODUCTS.find((candidate) => candidate.variants.some((v) => v._id === params?.variantId));
  if (!product) throw new Error(`Variant with ID ${params?.variantId} not found`);
  if (!product.composite) {
    return {
      success: false,
      reason: `${product.name} is not a composite: it takes no composite picks`,
      missing: [],
      fullPartIds: [],
      timestamp,
    };
  }
  const picks = params.composite ?? [];
  // What this outlet sells (the host's catalog-visibility rules).
  const composite = mockCompositeAtOutlet(product.composite, undefined, params.compositeSlot);
  const missing = mockPicksStillNeeded(composite, picks);
  const fullPartIds = mockFullPartIds(composite, picks);
  const quantity = params.quantity ?? 1;
  if (mockHiddenProductIds().has(product._id)) {
    return { success: false, reason: `${product.name} is not sold at this outlet`, missing, fullPartIds, timestamp };
  }
  const line =
    mockNeedsDateRefusal(product.name, composite, params.compositeSlot) ??
    compositePicksRefusal(composite, picks) ??
    mockCompositeLine(composite, picks, !product.taxTable);
  if (typeof line === 'string') return { success: false, reason: line, missing, fullPartIds, timestamp };
  const shortOfStock = mockCompositeStockRefusal([
    ...MOCK_CART.products,
    { variantId: params.variantId, quantity, components: line.components },
  ]);
  if (shortOfStock) return { success: false, reason: shortOfStock, missing, fullPartIds, timestamp };
  const unitTotal = line.price + buildModifierRows(line.modifiers, 1).modifiersTotal;
  return { success: true, total: unitTotal * quantity, unitTotal, missing, fullPartIds, timestamp };
};
