import { GetLoyalty, GetLoyaltyParams, GetLoyaltyResponse } from './types';
import { mockLoyaltyOutcome, mockLoyaltyState } from '../../demo/loyalty';

export const mockGetLoyalty: GetLoyalty = async (params?: GetLoyaltyParams): Promise<GetLoyaltyResponse> => {
  console.log('[Mock] getLoyalty called', params);
  return { ...mockLoyaltyOutcome(), loyalty: mockLoyaltyState() };
};
