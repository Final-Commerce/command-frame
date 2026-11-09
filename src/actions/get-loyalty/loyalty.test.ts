import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';
import { MOCK_CART, MOCK_CUSTOMER_1, resetMockCart } from '../../demo/database';
import type { CFActiveProduct, CFLoyaltyDiscount } from '../../CommonTypes';
import { MOCK_LOYALTY, MOCK_LOYALTY_CODE, mockApplyToCart, mockJoin } from '../../demo/loyalty';
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
    expect(loyalty?.mode).toBe('staff');
    expect(loyalty?.member?.number).toBe('482913756');
    expect(JSON.stringify(loyalty?.member)).not.toContain('giuseppe@example.com');
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
      label: '$5 off',
      redemptionId: expect.stringMatching(/^lr_mock/),
    });
    expect(MOCK_CART.discount?.label).toBe(five.applied!.label);
    expect((await mockGetLoyalty()).loyalty?.member?.balance).toBe(4);

    const offer = await mockApplyLoyaltyReward({ code: 'THANKS10' });
    expect(offer).toMatchObject({ success: false, refusal: 'cart_discount_taken' });

    expect((await mockRemoveLoyaltyReward({ redemptionId: five.applied!.redemptionId })).success).toBe(true);
    expect(MOCK_CART.discount).toBeUndefined();
    expect((await mockGetLoyalty()).loyalty?.member?.balance).toBe(10);
  });

  it('takes a coupon code with nobody on the sale', async () => {
    const shared = await mockApplyLoyaltyReward({ code: 'welcome5' });
    expect(shared).toMatchObject({ success: true, applied: { appliedTo: 'cart', offerId: 'lo_mock_welcome' } });
    resetMockCart();
    const printed = await mockApplyLoyaltyReward({ code: 'THANKS10' });
    expect(printed).toMatchObject({ success: true, applied: { offerId: 'lo_mock_1' } });
    expect((await mockApplyLoyaltyReward({ grantId: 'lg_mock_1' })).refusal).toBe('check_needed');
  });

  it('puts a free item on a line of one, and on the cart slot for a line of more', async () => {
    MOCK_CART.customer = MOCK_CUSTOMER_1;
    const line = addLine('line-1', 1);
    const one = await mockApplyLoyaltyReward({ rewardId: 'free_drink' });
    expect(one.applied).toMatchObject({ appliedTo: 'lines', internalIds: [line.internalId] });

    await mockRemoveLoyaltyReward({ redemptionId: one.applied!.redemptionId });
    resetMockCart();
    Object.assign(MOCK_LOYALTY, { applied: [] });
    MOCK_CART.customer = MOCK_CUSTOMER_1;
    addLine('line-2', 2);
    MOCK_CART.discount = { value: 100, isPercent: false, label: 'Staff' };
    const many = await mockApplyLoyaltyReward({ rewardId: 'free_drink' });
    expect(many).toMatchObject({ success: false, refusal: 'cart_discount_taken' });
  });

  it('matches products the way the till does, by the line or its variant', () => {
    const line = addLine('line-3', 1);
    const byId = mockApplyToCart('One thing', freeItem([line.id]), noIds);
    expect(byId).toMatchObject({ appliedTo: 'lines', internalIds: [line.internalId] });
    const byProductId = mockApplyToCart('Nothing', freeItem(['not-a-line-id']), noIds);
    expect(byProductId).toMatchObject({ success: false, refusal: 'nothing_to_discount' });
  });

  it('turns a capped percentage off everything into the capped amount', () => {
    MOCK_CART.subtotal = 10_000;
    const capped = mockApplyToCart('20% off, up to $5', percentOff(20, 500), noIds);
    expect(capped).toMatchObject({ appliedTo: 'cart' });
    expect(MOCK_CART.discount).toMatchObject({ value: 500, isPercent: false });
  });

  it('refuses a discount no till would put on a cart', () => {
    expect(mockApplyToCart('Nothing off', { ...percentOff(20, null), kind: 'amount_off' }, noIds)).toMatchObject({
      refusal: 'unavailable',
    });
    expect(mockApplyToCart('Too much', percentOff(150, null), noIds)).toMatchObject({ refusal: 'unavailable' });
    expect(MOCK_CART.discount).toBeUndefined();
  });

  it('links a found card to the customer only when asked', async () => {
    MOCK_CART.customer = { ...MOCK_CUSTOMER_1, _id: 'cust_not_linked' };
    const joined = await mockJoinLoyalty({ name: 'Walk-in', email: 'walkin@example.com' });
    MOCK_CART.customer = { ...MOCK_CUSTOMER_1, _id: 'cust_new' };
    const first = await mockFindLoyaltyMember({ cardNumber: joined.member!.number });
    expect(first).toMatchObject({ success: true, canLink: false });

    const card = mockJoin({ name: 'Unlinked', email: 'unlinked@example.com' });
    const asked = await mockFindLoyaltyMember({ cardNumber: card.number });
    expect(asked).toMatchObject({ success: true, canLink: true });
    expect(card.customerId).toBeNull();
    const linked = await mockFindLoyaltyMember({ cardNumber: card.number, link: true });
    expect(linked.canLink).toBe(false);
    expect(card.customerId).toBe('cust_new');
  });
});

const noIds = { rewardId: null, offerId: null };
/** A line on the mock cart, shaped like the host's. */
const addLine = (internalId: string, quantity: number): CFActiveProduct => {
  const line = {
    id: `prod-${internalId}`,
    variantId: null,
    internalId,
    name: 'Flat white',
    price: 450,
    quantity,
    discounts: [],
  } as unknown as CFActiveProduct;
  MOCK_CART.products.push(line);
  return line;
};
const freeItem = (productIds: string[]): CFLoyaltyDiscount => ({
  kind: 'free_item',
  valueMinor: null,
  percent: null,
  productIds,
  maxValueMinor: null,
});
const percentOff = (percent: number, maxValueMinor: number | null): CFLoyaltyDiscount => ({
  kind: 'percent_off',
  valueMinor: null,
  percent,
  productIds: [],
  maxValueMinor,
});
