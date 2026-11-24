import { StartLoyaltyCheck, StartLoyaltyCheckParams, StartLoyaltyCheckResponse } from './types';
import {
  MOCK_LOYALTY,
  MOCK_LOYALTY_CODE,
  mockFindMember,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
} from '../../demo/loyalty';

export const mockStartLoyaltyCheck: StartLoyaltyCheck = async (
  params: StartLoyaltyCheckParams,
): Promise<StartLoyaltyCheckResponse> => {
  console.log(`[Mock] startLoyaltyCheck called — the mock code is ${MOCK_LOYALTY_CODE}`, params);
  if (params?.cardNumber) {
    const member = mockFindMember({ cardNumber: params.cardNumber });
    if (!member) return mockLoyaltyRefusal('not_member', 'No card with that number.');
    MOCK_LOYALTY.check = { memberId: member.id, contact: member.phone ?? member.email ?? '', confirmed: false };
    return {
      ...mockLoyaltyOutcome(),
      channel: member.phone ? 'sms' : 'email',
      expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
    };
  }
  const contact = params?.phone ?? params?.email;
  if (!contact) return mockLoyaltyRefusal('bad_request', "Type a phone number, an email or the card's number.");
  const member = mockFindMember({ phone: params.phone, email: params.email });
  MOCK_LOYALTY.check = { memberId: member?.id ?? null, contact, confirmed: false };
  return {
    ...mockLoyaltyOutcome(),
    channel: params.phone ? 'sms' : 'email',
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  };
};
