import { CFProductType, CurrencyCode } from '../../CommonTypes';
import { AddProduct, AddProductParams, AddProductResponse } from './types';

export const mockAddProduct: AddProduct = async (params: AddProductParams): Promise<AddProductResponse> => {
  console.log('[Mock] addProduct called', params);
  const productId = params._id || 'mock_product_' + Date.now();
  return {
    success: true,
    product: {
      _id: productId,
      externalId: `ext_${productId}`,
      currency: CurrencyCode.USD,
      minorUnits: 2,
      name: params.name,
      description: params.description,
      shortDescription: params.shortDescription,
      categories: (params.categories || []).map((c: string) => ({ name: c, externalId: c })),
      taxTable: params.taxTable || '',
      images: params.images || [],
      status: params.status || 'active',
      sku: params.sku,
      tags: params.tags || [],
      productType: params.productType === 'variable' ? CFProductType.VARIABLE : CFProductType.SIMPLE,
      attributes: [],
      minPrice: 0,
      maxPrice: 0,
      variants: [],
    },
    timestamp: new Date().toISOString(),
  };
};
