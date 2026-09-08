/**
 * Select all refund items action
 * Calls the selectAllRefundItems action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { SelectAllRefundItems, SelectAllRefundItemsParams, SelectAllRefundItemsResponse } from './types';

export const selectAllRefundItems: SelectAllRefundItems = async (
  params?: SelectAllRefundItemsParams,
): Promise<SelectAllRefundItemsResponse> => {
  return await commandFrameClient.call<SelectAllRefundItemsParams | undefined, SelectAllRefundItemsResponse>(
    'selectAllRefundItems',
    params,
  );
};
