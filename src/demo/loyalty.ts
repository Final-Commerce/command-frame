/**
 * The loyalty commands' mock: one stamp card, one member (the demo's first customer), a code
 * every check accepts, and the cart's single discount slot. It refuses what the host refuses —
 * a card nobody proved on a customer screen, a reward the balance can't pay, a second cart
 * discount — so a loyalty screen built against it handles the answers a real till gives.
 */

import type {
  CFActiveProduct,
  CFLoyaltyApplied,
  CFLoyaltyDiscount,
  CFLoyaltyMember,
  CFLoyaltyMode,
  CFLoyaltyOffer,
  CFLoyaltyOutcome,
  CFLoyaltyProgram,
  CFLoyaltyRefusal,
  CFLoyaltyState,
} from '../CommonTypes';
import { MOCK_CART, MOCK_CUSTOMER_1, mockPublishEvent } from './database';

/** Every mock check takes this code. */
export const MOCK_LOYALTY_CODE = '123456';

const discount = (d: Partial<CFLoyaltyDiscount> & Pick<CFLoyaltyDiscount, 'kind'>): CFLoyaltyDiscount => ({
  valueMinor: null,
  percent: null,
  productIds: [],
  maxValueMinor: null,
  ...d,
});

export const MOCK_LOYALTY_PROGRAM: CFLoyaltyProgram = {
  id: 'lp_mock',
  name: 'Harbour card',
  kind: 'stamps',
  status: 'live',
  unit: { one: 'stamp', many: 'stamps' },
  rewards: [
    { id: 'free_drink', name: 'A drink on us', cost: 10, ...discount({ kind: 'free_item', maxValueMinor: 600 }) },
    { id: 'five_off', name: '$5 off', cost: 6, ...discount({ kind: 'amount_off', valueMinor: 500 }) },
  ],
  card: { title: 'Harbour card', background: '#0F3D3E', foreground: '#FFFFFF', label: '#9FD8CB' },
};

interface MockMember {
  id: string;
  customerId: string | null;
  name: string | null;
  number: string;
  balance: number;
  phone: string | null;
  email: string | null;
  offers: CFLoyaltyOffer[];
}

const MEMBERS: MockMember[] = [
  {
    id: 'lm_mock_1',
    customerId: MOCK_CUSTOMER_1._id ?? null,
    name: 'Giuseppe Verdi',
    number: '482913756',
    balance: 10,
    phone: '555-0101',
    email: 'giuseppe@example.com',
    offers: [
      {
        grantId: 'lg_mock_1',
        offerId: 'lo_mock_1',
        name: '10% off your next visit',
        code: 'THANKS10',
        discount: discount({ kind: 'percent_off', percent: 10 }),
        minSpendMinor: null,
        expiresAt: null,
      },
    ],
  },
];

/** A coupon anyone can use, from a post or a printed voucher: a code needs no member on the sale. */
const SHARED_OFFERS: CFLoyaltyOffer[] = [
  {
    grantId: 'lg_mock_shared',
    offerId: 'lo_mock_welcome',
    name: '$5 off your first order',
    code: 'WELCOME5',
    discount: discount({ kind: 'amount_off', valueMinor: 500 }),
    minSpendMinor: null,
    expiresAt: null,
  },
];

/** The offer a typed or scanned code is: a shared code, or the code on any member's card. */
export function mockOfferByCode(code: string | null | undefined): CFLoyaltyOffer | null {
  const typed = (code ?? '').trim().toUpperCase();
  if (!typed) return null;
  return [...SHARED_OFFERS, ...MEMBERS.flatMap((m) => m.offers)].find((o) => o.code.toUpperCase() === typed) ?? null;
}

/** What the mock till knows about this sale. `mode` can be set to try a customer screen. */
export const MOCK_LOYALTY: {
  mode: CFLoyaltyMode;
  memberId: string | null;
  check: { memberId: string | null; contact: string; confirmed: boolean } | null;
  applied: CFLoyaltyApplied[];
} = { mode: 'staff', memberId: null, check: null, applied: [] };

let redemptions = 0;

export const mockLoyaltyOutcome = (): CFLoyaltyOutcome => ({ success: true, timestamp: new Date().toISOString() });

export const mockLoyaltyRefusal = (refusal: CFLoyaltyRefusal, reason: string): CFLoyaltyOutcome => ({
  success: false,
  refusal,
  reason,
  timestamp: new Date().toISOString(),
});

const digits = (s: string | null | undefined) => (s ?? '').replace(/\D/g, '');

export function mockFindMember(by: {
  cardNumber?: string;
  phone?: string;
  email?: string;
  customerId?: string | null;
}): MockMember | null {
  return (
    MEMBERS.find(
      (m) =>
        (by.cardNumber && digits(by.cardNumber) === m.number) ||
        (by.phone && digits(by.phone).slice(-7) === digits(m.phone).slice(-7)) ||
        (by.email && by.email.trim().toLowerCase() === m.email) ||
        (by.customerId && by.customerId === m.customerId),
    ) ?? null
  );
}

export function mockMemberView(m: MockMember): CFLoyaltyMember {
  const size = Math.max(...MOCK_LOYALTY_PROGRAM.rewards.map((r) => r.cost));
  const next = MOCK_LOYALTY_PROGRAM.rewards.filter((r) => r.cost > m.balance).sort((a, b) => a.cost - b.cost)[0];
  return {
    id: m.id,
    name: m.name,
    number: m.number,
    balance: m.balance,
    headline: `${Math.min(m.balance, size)} of ${size} stamps`,
    next: next
      ? `${next.cost - m.balance} more ${next.cost - m.balance === 1 ? 'stamp' : 'stamps'} for ${next.name}`
      : null,
    rewards: MOCK_LOYALTY_PROGRAM.rewards.map((r) => ({ ...r, available: r.cost <= m.balance })),
    offers: m.offers,
  };
}

/** The member on this sale: one found, joined or proved on it, else (staff) the cart's customer. */
export function mockSaleMember(): MockMember | null {
  if (MOCK_LOYALTY.memberId) return MEMBERS.find((m) => m.id === MOCK_LOYALTY.memberId) ?? null;
  if (MOCK_LOYALTY.mode === 'staff')
    return mockFindMember({ customerId: (MOCK_CART.customer as { _id?: string } | null)?._id ?? null });
  return null;
}

export function mockLoyaltyState(): CFLoyaltyState {
  const member = mockSaleMember();
  const proved = MOCK_LOYALTY.check?.confirmed ?? false;
  return {
    program: MOCK_LOYALTY_PROGRAM,
    member: member ? mockMemberView(member) : null,
    canJoin: !member && (MOCK_LOYALTY.mode === 'staff' ? Boolean(MOCK_CART.customer) : proved),
    mode: MOCK_LOYALTY.mode,
    checkPending: Boolean(MOCK_LOYALTY.check && !MOCK_LOYALTY.check.confirmed),
    applied: MOCK_LOYALTY.applied,
  };
}

export function mockSetSaleMember(m: MockMember | null): void {
  MOCK_LOYALTY.memberId = m?.id ?? null;
  mockPublishEvent('loyalty', 'member-changed', {
    member: m ? mockMemberView(m) : null,
    canJoin: mockLoyaltyState().canJoin,
  });
}

export function mockJoin(input: {
  name?: string;
  phone?: string;
  email?: string;
  customerId?: string | null;
}): MockMember {
  const member: MockMember = {
    id: `lm_mock_${MEMBERS.length + 1}`,
    customerId: input.customerId ?? null,
    name: input.name ?? null,
    number: String(482913756 + MEMBERS.length * 7919),
    balance: 0,
    phone: input.phone ?? null,
    email: input.email?.toLowerCase() ?? null,
    offers: [],
  };
  MEMBERS.push(member);
  return member;
}

/** A line a reward's `productIds` name, the way the host matches them: the line's product or its variant. */
const matchesLine = (line: CFActiveProduct, productIds: string[]): boolean =>
  !productIds.length || productIds.includes(line.id) || Boolean(line.variantId && productIds.includes(line.variantId));

/** Why the host would refuse what Engage sent before touching the cart, or null when it can go on. */
function unusable(d: CFLoyaltyDiscount): string | null {
  if (d.kind === 'amount_off' && !(Number.isInteger(d.valueMinor) && (d.valueMinor ?? 0) > 0)) return 'no amount';
  if (d.kind === 'percent_off' && !(d.percent != null && d.percent > 0 && d.percent <= 100)) return 'no percentage';
  if (d.maxValueMinor != null && !(Number.isInteger(d.maxValueMinor) && d.maxValueMinor > 0)) return 'no cap';
  return null;
}

/**
 * Put a discount on the mock cart the way the host does. The cart has one discount slot: an amount
 * off, and a percentage off everything (capped, it becomes the capped amount), take it, and are
 * refused while it's taken. A percentage on some products goes on each matching line. A free item
 * is the cheapest matching line: on that line when it holds one, on the cart slot when it holds
 * more (a line discount comes off every unit).
 */
export function mockApplyToCart(
  name: string,
  d: CFLoyaltyDiscount,
  ids: { rewardId: string | null; offerId: string | null },
): CFLoyaltyApplied | CFLoyaltyOutcome {
  if (unusable(d)) return mockLoyaltyRefusal('unavailable', `${name} can't go on this sale. Carry on without it.`);
  const redemptionId = `lr_mock${(redemptions += 1).toString(16).padStart(8, '0')}`;
  // The reward's own name, like the host; the host names the hold in the order's metadata.
  const label = name;
  const taken = () =>
    mockLoyaltyRefusal(
      'cart_discount_taken',
      `The cart already has a discount (${MOCK_CART.discount?.label || 'Discount'}). Take it off first to use ${name}.`,
    );
  const toCart = (discount: { value: number; isPercent: boolean }): CFLoyaltyOutcome | null => {
    if (MOCK_CART.discount) return taken();
    MOCK_CART.discount = { ...discount, label };
    mockPublishEvent('cart', 'cart-discount-added', { discount: MOCK_CART.discount });
    return null;
  };
  const lines = MOCK_CART.products.filter((p) => (p.quantity ?? 0) > 0 && matchesLine(p, d.productIds));
  let appliedTo: CFLoyaltyApplied['appliedTo'] = 'cart';
  let internalIds: string[] = [];

  if (d.kind === 'amount_off') {
    const refused = toCart({ value: d.valueMinor!, isPercent: false });
    if (refused) return refused;
  } else if (d.kind === 'percent_off' && !d.productIds.length) {
    const percent = d.percent!;
    const refused =
      d.maxValueMinor != null
        ? toCart({
            value: Math.min(Math.round(((MOCK_CART.subtotal ?? 0) * percent) / 100), d.maxValueMinor),
            isPercent: false,
          })
        : toCart({ value: percent / 100, isPercent: true });
    if (refused) return refused;
  } else if (!lines.length) {
    return mockLoyaltyRefusal('nothing_to_discount', `Nothing in the cart ${name} can go on yet.`);
  } else if (d.kind === 'percent_off') {
    for (const line of lines)
      line.discounts = [...(line.discounts ?? []), { value: d.percent! / 100, isPercent: true, label }];
    appliedTo = 'lines';
    internalIds = lines.map((l) => l.internalId ?? '').filter(Boolean);
  } else {
    const line = lines.reduce((a, b) => ((b.price ?? 0) < (a.price ?? 0) ? b : a));
    const value = Math.min(line.price ?? 0, d.maxValueMinor ?? Number.POSITIVE_INFINITY);
    if ((line.quantity ?? 0) === 1) {
      line.discounts = [...(line.discounts ?? []), { value, isPercent: false, label }];
      appliedTo = 'lines';
      internalIds = line.internalId ? [line.internalId] : [];
    } else {
      const refused = toCart({ value, isPercent: false });
      if (refused) return refused;
    }
  }
  const applied: CFLoyaltyApplied = {
    redemptionId,
    label,
    name,
    ...ids,
    discount: d,
    appliedTo,
    internalIds,
    expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
  };
  MOCK_LOYALTY.applied = [...MOCK_LOYALTY.applied, applied];
  mockPublishEvent('loyalty', 'reward-applied', { applied });
  return applied;
}

export function mockRemoveFromCart(applied: CFLoyaltyApplied): void {
  if (applied.appliedTo === 'cart' && MOCK_CART.discount?.label === applied.label) {
    delete MOCK_CART.discount;
    mockPublishEvent('cart', 'cart-discount-removed', {});
  }
  // Only where it went, and only one of its name per line: a cashier's discount of the same name stays.
  for (const line of MOCK_CART.products) {
    if (applied.appliedTo !== 'lines' || !applied.internalIds.includes(line.internalId ?? '')) continue;
    const at = (line.discounts ?? []).findIndex((x) => x.label === applied.label);
    if (at >= 0) line.discounts = (line.discounts ?? []).filter((_, i) => i !== at);
  }
  MOCK_LOYALTY.applied = MOCK_LOYALTY.applied.filter((a) => a.redemptionId !== applied.redemptionId);
  mockPublishEvent('loyalty', 'reward-removed', { redemptionId: applied.redemptionId, why: 'removed' });
}

/** A reward's stamps come off when it's held, like the host. */
export function mockSpend(memberId: string, cost: number): boolean {
  const m = MEMBERS.find((x) => x.id === memberId);
  if (!m || m.balance < cost) return false;
  m.balance -= cost;
  return true;
}

export function mockGiveBack(memberId: string | null, cost: number): void {
  const m = MEMBERS.find((x) => x.id === memberId);
  if (m) m.balance += cost;
}
