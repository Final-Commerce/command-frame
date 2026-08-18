import { CFProduct, CFProductType, CFProductVariant, CurrencyCode } from '../../CommonTypes';
import { MOCK_OUTLETS, MOCK_PRODUCTS, safeSerialize } from '../../demo/database';
import { UpdateProductBundle, UpdateProductBundleParams, UpdateProductBundleResponse } from './types';

export const mockUpdateProductBundle: UpdateProductBundle = async (
  params: UpdateProductBundleParams,
): Promise<UpdateProductBundleResponse> => {
  console.log('[Mock] updateProductBundle called', params);

  const changes = params.productChanges || {};
  const deleted = params.variantDeletions || [];
  const existing = MOCK_PRODUCTS.find((p) => p._id === params.productId);

  const survivingVariants = (existing?.variants || [])
    .filter((v) => !deleted.includes(v._id))
    .map((v) => {
      const change = (params.variantChanges || []).find((c) => c._id === v._id);
      return change ? { ...v, ...change.changes } : v;
    });

  // Dense-seed inventory across ALL active outlets, same rule as
  // createProductWithVariants (§6.1/§6.3) — never only the outlets in
  // `outlets`, and regardless of any inventory hint on the addition itself.
  const newVariants: CFProductVariant[] = (params.variantAdditions || []).map((v, i) => {
    const _id = v._id || `mock_variant_${Date.now()}_${i}`;
    return {
      _id,
      sku: v.sku || '',
      barcode: v.barcode,
      price: v.price,
      costPrice: v.costPrice,
      salePrice: v.salePrice ?? 0,
      isOnSale: false,
      manageStock: v.manageStock ?? false,
      allowBackorder: v.allowBackorder ?? false,
      externalId: `ext_${_id}`,
      images: v.images || [],
      attributes: v.attributes || [],
      metadata: [],
      inventory: MOCK_OUTLETS.map((o) => ({ warehouse: 'main', outletId: o.id, stock: 0 })),
    };
  });

  const variants = [...survivingVariants, ...newVariants];
  const added = newVariants.map((v) => v._id);
  const changed = (params.variantChanges || []).map((c) => c._id);

  // undefined = leave taxTable alone; explicit null clears it (CFProduct.taxTable is non-nullable).
  const nextTaxTable = changes.taxTable !== undefined ? (changes.taxTable ?? '') : (existing?.taxTable ?? '');

  const product: CFProduct = existing
    ? {
        ...existing,
        name: changes.name ?? existing.name,
        description: changes.description ?? existing.description,
        shortDescription: changes.shortDescription ?? existing.shortDescription,
        categories: changes.categories
          ? changes.categories.map((c) => ({ name: c, externalId: c }))
          : existing.categories,
        taxTable: nextTaxTable,
        images: changes.images ?? existing.images,
        status: changes.status ?? existing.status,
        sku: changes.sku ?? existing.sku,
        tags: changes.tags ?? existing.tags,
        productType: newVariants.length > 0 ? CFProductType.VARIABLE : existing.productType,
        variants,
      }
    : {
        _id: params.productId,
        externalId: `ext_${params.productId}`,
        currency: CurrencyCode.USD,
        minorUnits: 2,
        name: changes.name || 'Updated Product',
        description: changes.description,
        shortDescription: changes.shortDescription,
        categories: (changes.categories || []).map((c) => ({ name: c, externalId: c })),
        taxTable: nextTaxTable,
        images: changes.images || [],
        status: changes.status || 'active',
        sku: changes.sku,
        tags: changes.tags || [],
        productType: newVariants.length > 0 ? CFProductType.VARIABLE : CFProductType.SIMPLE,
        attributes: [],
        variants,
      };

  return {
    success: true,
    product: safeSerialize(product),
    added,
    changed,
    deleted,
    timestamp: new Date().toISOString(),
  };
};
