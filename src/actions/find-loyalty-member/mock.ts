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
import { MOCK_CART } from '../../demo/database';

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
  // A card nobody is linked to, found while the sale has a customer: linked only when the cashier said so.
  const customerId = (MOCK_CART.customer as { _id?: string } | null)?._id ?? null;
  const unlinked = Boolean(found && customerId && !found.customerId);
  if (found && unlinked && params.link) found.customerId = customerId;
  if (found) mockSetSaleMember(found);
  return {
    ...mockLoyaltyOutcome(),
    member: found ? mockMemberView(found) : null,
    canJoin: !found && mockLoyaltyState().canJoin,
    canLink: unlinked && !params.link,
  };
};
