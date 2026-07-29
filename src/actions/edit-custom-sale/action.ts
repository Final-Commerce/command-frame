/**
 * Edit custom sale action
 * Calls the editCustomSale action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { EditCustomSale, EditCustomSaleParams, EditCustomSaleResponse } from './types';

export const editCustomSale: EditCustomSale = async (
  params?: EditCustomSaleParams,
): Promise<EditCustomSaleResponse> => {
  return await commandFrameClient.call<EditCustomSaleParams, EditCustomSaleResponse>('editCustomSale', params);
};
