import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';
import { MOCK_CART, MOCK_CUSTOMER_1, resetMockCart } from '../../demo/database';
import { MOCK_LOYALTY, MOCK_LOYALTY_CODE } from '../../demo/loyalty';
import { getLoyalty } from './action';
import { mockGetLoyalty } from './mock';
import { applyLoyaltyReward } from '../apply-loyalty-reward/action';
import { mockApplyLoyaltyReward } from '../apply-loyalty-reward/mock';
import { mockConfirmLoyaltyCheck } from '../confirm-loyalty-check/mock';
import { mockFindLoyaltyMember } from '../find-loyalty-member/mock';
import { mockJoinLoyalty } from '../join-loyalty/mock';
import { mockRemoveLoyaltyReward } from '../remove-loyalty-reward/mock';
import { mockStartLoyaltyCheck } from '../start-loyalty-check/mock';

const mockCall = vi.mocked(commandFrameClient).call;

beforeEach(() => {
  resetMockCart();
  Object.assign(MOCK_LOYALTY, { mode: 'staff', memberId: null, check: null, applied: [] });
});

describe('loyalty actions on the wire', () => {
  it('call the host by their own names', async () => {
    mockCall.mockResolvedValue({ success: true });
    await getLoyalty({ refresh: true });
    expect(mockCall).toHaveBeenCalledWith('getLoyalty', { refresh: true });
    await applyLoyaltyReward({ rewardId: 'free_drink' });
    expect(mockCall).toHaveBeenCalledWith('applyLoyaltyReward', { rewardId: 'free_drink' });
  });
});

describe('the loyalty mock behaves like the host', () => {
  it('looks up the cart customer at a staffed till, and never shows an email or phone', async () => {
    MOCK_CART.customer = MOCK_CUSTOMER_1;
    const { loyalty } = await mockGetLoyalty();
    expect(loyalty.mode).toBe('staff');
    expect(loyalty.member?.number).toBe('482913756');
    expect(JSON.stringify(loyalty.member)).not.toContain('giuseppe@example.com');
  });

  it('on a customer screen, shows a card only after the code', async () => {
    MOCK_LOYALTY.mode = 'customer';
    const typed = await mockFindLoyaltyMember({ cardNumber: '482913756' });
    expect(typed).toMatchObject({ success: false, refusal: 'check_needed', member: null });

    const sent = await mockStartLoyaltyCheck({ cardNumber: '482913756' });
    expect(sent).toMatchObject({ success: true, channel: 'sms' });
    expect(JSON.stringify(sent)).not.toContain('555');
    expect((await mockConfirmLoyaltyCheck({ code: '000000' })).refusal).toBe('wrong_code');
    const proved = await mockConfirmLoyaltyCheck({ code: MOCK_LOYALTY_CODE });
    expect(proved.member?.number).toBe('482913756');
  });

  it('joins a customer with the contact their code proved', async () => {
    MOCK_LOYALTY.mode = 'customer';
    expect((await mockJoinLoyalty({ name: 'Bo' })).refusal).toBe('check_needed');
    await mockStartLoyaltyCheck({ phone: '555-0199' });
    await mockConfirmLoyaltyCheck({ code: MOCK_LOYALTY_CODE });
    const joined = await mockJoinLoyalty({ name: 'Bo', phone: '555-0100' });
    expect(joined).toMatchObject({ success: true, created: true, member: { name: 'Bo', balance: 0 } });
  });

  it('takes the stamps when a reward goes on, refuses a second cart discount, and gives them back', async () => {
    MOCK_CART.customer = MOCK_CUSTOMER_1;
    const five = await mockApplyLoyaltyReward({ rewardId: 'five_off' });
    expect(five.applied).toMatchObject({
      appliedTo: 'cart',
      label: expect.stringMatching(/^\$5 off \[lr_mock[0-9a-f]{8}\]$/),
    });
    expect(MOCK_CART.discount?.label).toBe(five.applied!.label);
    expect((await mockGetLoyalty()).loyalty.member?.balance).toBe(4);

    const offer = await mockApplyLoyaltyReward({ code: 'THANKS10' });
    expect(offer).toMatchObject({ success: false, refusal: 'cart_discount_taken' });

    expect((await mockRemoveLoyaltyReward({ redemptionId: five.applied!.redemptionId })).success).toBe(true);
    expect(MOCK_CART.discount).toBeUndefined();
    expect((await mockGetLoyalty()).loyalty.member?.balance).toBe(10);
  });
});
