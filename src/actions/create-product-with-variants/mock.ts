import { CFProduct, CFProductType, CFProductVariant, CurrencyCode } from '../../CommonTypes';
import { MOCK_COMPANY, MOCK_OUTLETS, safeSerialize } from '../../demo/database';
import {
  CreateProductVariantInput,
  CreateProductWithVariants,
  CreateProductWithVariantsParams,
  CreateProductWithVariantsResponse,
} from './types';

// One variant doc per input (or the mandatory default variant for a simple
// product, §6.2). Inventory is dense-seeded across ALL active outlets at
// quantity 0 (§6.1/§6.3) — never only the outlets the caller happened to list.
const buildVariantDoc = (
  input: CreateProductVariantInput,
  manageStockDefault: boolean,
  index: number,
): CFProductVariant => {
  const _id = input._id || `mock_variant_${Date.now()}_${index}`;
  return {
    _id,
    sku: input.sku || '',
    barcode: input.barcode,
    price: input.price,
    costPrice: input.costPrice,
    salePrice: input.salePrice ?? 0,
    isOnSale: false,
    manageStock: input.manageStock ?? manageStockDefault,
    allowBackorder: input.allowBackorder ?? false,
    externalId: `ext_${_id}`,
    images: input.images || [],
    attributes: input.attributes || [],
    metadata: [],
    inventory: MOCK_OUTLETS.map((o) => ({ warehouse: 'main', outletId: o.id, stock: 0 })),
  };
};

export const mockCreateProductWithVariants: CreateProductWithVariants = async (
  params: CreateProductWithVariantsParams,
): Promise<CreateProductWithVariantsResponse> => {
  console.log('[Mock] createProductWithVariants called', params);

  const productId = 'mock_product_' + Date.now();
  const manageStockDefault = params.manageStock ?? false;
  const isVariable = !!params.variants && params.variants.length > 0;

  // Simple product ⇒ exactly one auto-variant carrying price/costPrice/salePrice/
  // sku/barcode from the product payload (§6.2).
  const variantInputs: CreateProductVariantInput[] = isVariable
    ? params.variants!
    : [
        {
          name: params.name,
          sku: params.sku,
          barcode: params.barcode,
          price: params.price ?? 0,
          costPrice: params.costPrice,
          salePrice: params.salePrice,
        },
      ];

  const variants = variantInputs.map((v, i) => buildVariantDoc(v, manageStockDefault, i));
  const prices = variants.map((v) => v.price);

  const product: CFProduct = {
    _id: productId,
    companyId: MOCK_COMPANY.id!,
    externalId: `ext_${productId}`,
    currency: CurrencyCode.USD,
    minorUnits: 2,
    name: params.name,
    description: params.description,
    shortDescription: params.shortDescription,
    sku: params.sku,
    categories: (params.categories || []).map((c) => ({ name: c, externalId: c })),
    taxTable: params.taxTable || '',
    images: params.images || [],
    status: params.status || 'active',
    tags: params.tags || [],
    productType: isVariable ? CFProductType.VARIABLE : CFProductType.SIMPLE,
    attributes: [],
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    variants,
  };

  return {
    success: true,
    product: safeSerialize(product),
    timestamp: new Date().toISOString(),
  };
};
