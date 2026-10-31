import { JoinLoyalty, JoinLoyaltyParams, JoinLoyaltyResponse } from './types';
import { MOCK_CART } from '../../demo/database';
import {
  MOCK_LOYALTY,
  mockJoin,
  mockLoyaltyOutcome,
  mockLoyaltyRefusal,
  mockMemberView,
  mockSaleMember,
  mockSetSaleMember,
} from '../../demo/loyalty';

export const mockJoinLoyalty: JoinLoyalty = async (params?: JoinLoyaltyParams): Promise<JoinLoyaltyResponse> => {
  console.log('[Mock] joinLoyalty called', params);
  const already = mockSaleMember();
  if (already) return { ...mockLoyaltyOutcome(), member: mockMemberView(already), created: false };
  if (MOCK_LOYALTY.mode === 'customer') {
    // A customer joins with what their code proved, never with what the screen says.
    if (!MOCK_LOYALTY.check?.confirmed)
      return {
        ...mockLoyaltyRefusal('check_needed', 'Type your phone or email to get a code first.'),
        member: null,
        created: false,
      };
    const contact = MOCK_LOYALTY.check.contact;
    const joined = mockJoin({
      name: params?.name,
      ...(contact.includes('@') ? { email: contact } : { phone: contact }),
    });
    mockSetSaleMember(joined);
    return { ...mockLoyaltyOutcome(), member: mockMemberView(joined), created: true };
  }
  const customer = MOCK_CART.customer as {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  if (!customer && !params?.email && !params?.phone) {
    return {
      ...mockLoyaltyRefusal('bad_request', 'Joining needs the customer on the sale, an email or a phone.'),
      member: null,
      created: false,
    };
  }
  const joined = mockJoin({
    customerId: customer?._id ?? null,
    name: params?.name ?? ([customer?.firstName, customer?.lastName].filter(Boolean).join(' ') || undefined),
    email: params?.email ?? customer?.email,
    phone: params?.phone ?? customer?.phone,
  });
  mockSetSaleMember(joined);
  return { ...mockLoyaltyOutcome(), member: mockMemberView(joined), created: true };
};
