import type { SetActiveProduct, SetActiveProductParams, SetActiveProductResponse } from './types';
import { MOCK_PRODUCTS, setMockActiveProduct } from '../../demo/database';
import { resolveUnit } from '@final-commerce/common';

export const mockSetActiveProduct: SetActiveProduct = async (
  params?: SetActiveProductParams,
): Promise<SetActiveProductResponse> => {
  console.log('[Mock] setActiveProduct called', params);

  if (!params?.variantId) {
    throw new Error('Variant ID is required');
  }

  const { variantId } = params;

  let matchedProduct;
  let matchedVariant;

  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants.find((v) => v._id === variantId);
    if (variant) {
      matchedProduct = product;
      matchedVariant = variant;
      break;
    }
  }

  // The unit the variant sells in, resolved exactly as the add-to-cart mock does — the
  // product card reads the ACTIVE product, and without this it cannot label "100" as kg.
  const unit = matchedVariant?.unitId ? resolveUnit(matchedVariant.unitId) : undefined;

  const activeProduct = {
    id: matchedProduct?._id || 'mock_product',
    internalId: `internal_${Date.now()}`,
    externalId: matchedVariant?.externalId || 'mock_external_id',
    productExternalId: matchedProduct?.externalId || 'mock_product_external_id',
    variantId: matchedVariant?._id || variantId,
    name: matchedProduct?.name || 'Mock Product',
    sku: matchedVariant?.sku || 'mock_sku',
    price: matchedVariant?.price || 100,
    images: matchedVariant?.images || matchedProduct?.images || [],
    taxTableId: matchedProduct?.taxTable || 'mock_tax_table_id',
    quantity: 1,
    note: undefined as string | undefined,
    discount: undefined,
    description: matchedProduct?.description || 'Mock Description',
    barcodeId: matchedVariant?.barcode || 'mock_barcode_id',
    stock: matchedVariant?.inventory?.[0]?.stock ?? 100,
    ...(unit ? { unit } : {}),
    allowBackOrder: matchedVariant?.allowBackorder || false,
    fee: undefined,
    isUnlimited: !matchedVariant?.manageStock,
    attributes: matchedVariant?.attributes?.map((a) => a.value).join(', ') || '',
    localQuantity: 1,
  };

  setMockActiveProduct(activeProduct);

  return {
    success: true,
    product: activeProduct,
    timestamp: new Date().toISOString(),
  };
};
