import { AddProductFee, AddProductFeeParams, AddProductFeeResponse } from './types';
import { MOCK_CART } from '../../demo/database';

export const mockAddProductFee: AddProductFee = async (
  params?: AddProductFeeParams,
): Promise<AddProductFeeResponse> => {
  console.log('[Mock] addProductFee called', params);

  if (params) {
    let item = null;
    if (params.internalId) {
      item = MOCK_CART.products.find((p) => p.internalId === params.internalId);
    } else if (MOCK_CART.products.length > 0) {
      item = MOCK_CART.products[MOCK_CART.products.length - 1];
    }

    // Like the host (FT-83): a composite taxed by its items has no table a taxable fee could inherit.
    if (item && params.applyTaxes && !item.taxTableId && item.components?.length) {
      throw new Error(`${item.name} is taxed by its items: a taxable fee on it has no table to inherit`);
    }
    if (item) {
      item.fees = [
        {
          label: params.label || 'Fee',
          amount: params.amount,
          isPercent: params.isPercent || false,
          applyTaxes: params.applyTaxes || false,
        },
      ];
    }
  }

  return {
    success: true,
    amount: params?.amount || 0,
    isPercent: params?.isPercent || false,
    label: params?.label || '',
    applyTaxes: params?.applyTaxes || false,
    internalId: params?.internalId,
    timestamp: new Date().toISOString(),
  };
};
