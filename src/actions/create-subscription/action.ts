import { commandFrameClient } from '../../client';
import type { CreateSubscription, CreateSubscriptionParams, CreateSubscriptionResponse } from './types';

export const createSubscription: CreateSubscription = async (
  params: CreateSubscriptionParams,
): Promise<CreateSubscriptionResponse> => {
  return await commandFrameClient.call<CreateSubscriptionParams, CreateSubscriptionResponse>(
    'createSubscription',
    params,
  );
};
