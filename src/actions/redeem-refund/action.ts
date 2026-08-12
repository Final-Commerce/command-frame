/**
 * Redeem refund action
 * Calls the redeemRefund action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { RedeemRefund, RedeemRefundParams, RedeemRefundResponse } from './types';

export const redeemRefund: RedeemRefund = async (params: RedeemRefundParams): Promise<RedeemRefundResponse> => {
  return await commandFrameClient.call<RedeemRefundParams, RedeemRefundResponse>('redeemRefund', params);
};
