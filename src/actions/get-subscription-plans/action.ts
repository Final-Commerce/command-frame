import { commandFrameClient } from '../../client';
import type { GetSubscriptionPlans, GetSubscriptionPlansParams, GetSubscriptionPlansResponse } from './types';

export const getSubscriptionPlans: GetSubscriptionPlans = async (
  params?: GetSubscriptionPlansParams,
): Promise<GetSubscriptionPlansResponse> => {
  return await commandFrameClient.call<GetSubscriptionPlansParams, GetSubscriptionPlansResponse>(
    'getSubscriptionPlans',
    params ?? ({} as GetSubscriptionPlansParams),
  );
};
