import { CreateSubscription, CreateSubscriptionParams, CreateSubscriptionResponse } from './types';

export const mockCreateSubscription: CreateSubscription = async (
  params: CreateSubscriptionParams,
): Promise<CreateSubscriptionResponse> => {
  console.log('[Mock] createSubscription called', params);
  const timestamp = new Date().toISOString();
  // Same refusal and text as the host, resolved instead of thrown. The server's checks are not copied here.
  if (!params?.customerId || !params.planId) {
    return { success: false, reason: 'customerId and planId are required', timestamp };
  }
  return { success: true, subscriptionId: `sub_${Date.now()}`, status: 'incomplete', timestamp };
};
