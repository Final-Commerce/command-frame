import { GetProducts, GetProductsParams, GetProductsResponse } from './types';
import { MOCK_PRODUCTS, safeSerialize } from '../../demo/database';
import { resolveUnit } from '@final-commerce/common';

export const mockGetProducts: GetProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
  console.log('[Mock] getProducts called', params);

  // Simple filter simulation
  let products = MOCK_PRODUCTS;
  const query = params?.query || {};

  if (query.searchValue) {
    const search = String(query.searchValue).toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(search) || p.sku?.toLowerCase().includes(search));
  }

  if (query.categories) {
    // Handle categories filter: { $in: [...] } or direct string
    const catFilter = query.categories;
    if (typeof catFilter === 'string') {
      products = products.filter((p) => (p.categories || []).some((c) => c.name === catFilter));
    } else if (typeof catFilter === 'object' && '$in' in catFilter) {
      const inList = (catFilter as any).$in as string[];
      products = products.filter((p) => (p.categories || []).some((c) => inList.includes(c.name)));
    } else if (typeof catFilter === 'object' && '$contains' in catFilter) {
      const containsVal = (catFilter as any).$contains as string;
      products = products.filter((p) => (p.categories || []).some((c) => c.name.includes(containsVal)));
    }
  }

  const total = products.length;
  const offset = params?.offset ?? 0;
  const limit = params?.limit ?? 100;
  const paged = products.slice(offset, offset + limit);

  // Mirror the real host's attachUnits: storage carries only `unitId`, the wire shape
  // adds the RESOLVED unit (abbreviation, ratioToBase, precision) so a card can label
  // stock and a quantity input can pick its step. Unresolvable ids pass through bare
  // rather than killing the page — same stance as the host's per-variant catch.
  const withUnits = safeSerialize(paged).map((product: any) => ({
    ...product,
    variants: (product.variants ?? []).map((variant: any) => {
      if (!variant.unitId) return variant;
      try {
        return { ...variant, unit: resolveUnit(variant.unitId) };
      } catch {
        return variant;
      }
    }),
  }));

  return {
    products: withUnits,
    total,
    timestamp: new Date().toISOString(),
  };
};
