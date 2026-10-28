import { FindLoyaltyMember, FindLoyaltyMemberParams, FindLoyaltyMemberResponse } from './types';
import {
  MOCK_LOYALTY,
  mockFindMember,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
  mockLoyaltyState,
  mockMemberView,
  mockSetSaleMember,
} from '../../demo/loyalty';

export const mockFindLoyaltyMember: FindLoyaltyMember = async (
  params: FindLoyaltyMemberParams,
): Promise<FindLoyaltyMemberResponse> => {
  console.log('[Mock] findLoyaltyMember called', params);
  // On a customer screen a number or an email proves nothing: the host refuses, and so does the mock.
  if (MOCK_LOYALTY.mode === 'customer') {
    return {
      ...mockLoyaltyRefusal('check_needed', 'Type your phone, email or card number to get a code first.'),
      member: null,
      canJoin: false,
    };
  }
  if (!params?.cardNumber && !params?.phone && !params?.email) {
    return {
      ...mockLoyaltyRefusal('bad_request', 'Scan or type a card number, a phone or an email.'),
      member: null,
      canJoin: false,
    };
  }
  const found = mockFindMember(params);
  if (found) mockSetSaleMember(found);
  return {
    ...mockLoyaltyOutcome(),
    member: found ? mockMemberView(found) : null,
    canJoin: !found && mockLoyaltyState().canJoin,
  };
};
