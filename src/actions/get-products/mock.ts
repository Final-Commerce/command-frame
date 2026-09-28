import { GetProducts, GetProductsParams, GetProductsResponse } from './types';
import { MOCK_PRODUCTS, safeSerialize } from '../../demo/database';
import { resolveUnit } from '@final-commerce/common';

export const mockGetProducts: GetProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
  console.log('[Mock] getProducts called', params);

  // Simple filter simulation
  let products = MOCK_PRODUCTS;
  const query = params?.query || {};

  // Same rule as the real host: a bookable service is not catalogue stock and is left out unless
  // the query names `productType`. Mirrored here on purpose — a mock that hands back services the
  // device withholds is how a flow gets built around a grid that cannot exist.
  if (!JSON.stringify(query).includes('productType')) {
    products = products.filter((p) => (p as { productType?: string }).productType !== 'booking');
  }

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
