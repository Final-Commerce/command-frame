import { GetCompositePrice, GetCompositePriceParams, GetCompositePriceResponse } from './types';
import { MOCK_PRODUCTS, buildModifierRows } from '../../demo/database';
import { compositePicksRefusal, mockCompositeLine, mockPicksStillNeeded } from '../add-product-to-cart/mock';

// The same line the mock addProductToCart builds, priced for ONE composite and added to nothing.
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
      timestamp,
    };
  }
  const picks = params.composite ?? [];
  const missing = mockPicksStillNeeded(product.composite, picks);
  const line =
    compositePicksRefusal(product.composite, picks) ?? mockCompositeLine(product.composite, picks, !product.taxTable);
  if (typeof line === 'string') return { success: false, reason: line, missing, timestamp };
  return { success: true, total: line.price + buildModifierRows(line.modifiers, 1).modifiersTotal, missing, timestamp };
};
