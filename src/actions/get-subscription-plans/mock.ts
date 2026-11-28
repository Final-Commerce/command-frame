import { GetSubscriptionPlans, GetSubscriptionPlansResponse } from './types';
import { MOCK_PRODUCT_PASTE_TRIO, MOCK_SUBSCRIPTION_PLANS } from '../../demo/database';

export const mockGetSubscriptionPlans: GetSubscriptionPlans = async (): Promise<GetSubscriptionPlansResponse> => {
  console.log('[Mock] getSubscriptionPlans called');
  return {
    success: true,
    plans: MOCK_SUBSCRIPTION_PLANS,
    products: [MOCK_PRODUCT_PASTE_TRIO],
    timestamp: new Date().toISOString(),
  };
};
