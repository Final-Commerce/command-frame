import { ConfirmLoyaltyCheck, ConfirmLoyaltyCheckParams, ConfirmLoyaltyCheckResponse } from './types';
import {
  MOCK_LOYALTY,
  MOCK_LOYALTY_CODE,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
  mockSaleMember,
  mockMemberView,
  mockSetSaleMember,
  mockFindMember,
} from '../../demo/loyalty';

export const mockConfirmLoyaltyCheck: ConfirmLoyaltyCheck = async (
  params: ConfirmLoyaltyCheckParams,
): Promise<ConfirmLoyaltyCheckResponse> => {
  console.log('[Mock] confirmLoyaltyCheck called', params);
  const check = MOCK_LOYALTY.check;
  if (!check) return { ...mockLoyaltyRefusal('not_found', 'Ask for a code first.'), member: null, canJoin: false };
  if (params?.code?.replace(/\D/g, '') !== MOCK_LOYALTY_CODE) {
    return {
      ...mockLoyaltyRefusal('wrong_code', `That code isn't right (the mock's is ${MOCK_LOYALTY_CODE}).`),
      member: null,
      canJoin: false,
    };
  }
  check.confirmed = true;
  const member = check.memberId ? (mockFindMember({ phone: check.contact, email: check.contact }) ?? null) : null;
  if (member) mockSetSaleMember(member);
  const onSale = mockSaleMember();
  return { ...mockLoyaltyOutcome(), member: onSale ? mockMemberView(onSale) : null, canJoin: !onSale };
};
