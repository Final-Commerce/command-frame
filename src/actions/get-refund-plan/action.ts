/**
 * Get refund plan action
 * Calls the getRefundPlan action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { GetRefundPlan, GetRefundPlanParams, GetRefundPlanResponse } from './types';

export const getRefundPlan: GetRefundPlan = async (params?: GetRefundPlanParams): Promise<GetRefundPlanResponse> => {
  return await commandFrameClient.call<GetRefundPlanParams | undefined, GetRefundPlanResponse>('getRefundPlan', params);
};
