import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setTaxOverride } from './action';
import { mockSetTaxOverride } from './mock';
import { mockGetCurrentCart } from '../get-current-cart/mock';
import { MOCK_CART, MOCK_STATION, MOCK_USER, resetMockCart } from '../../demo/database';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

const seedCart = () => {
  resetMockCart();
  MOCK_CART.products = [
    { id: 'p-cut', internalId: 'line-cut', name: 'Haircut', price: 4000, quantity: 1, taxTableId: 'hst' } as never,
    { id: 'p-wax', internalId: 'line-wax', name: 'Wax', price: 1500, quantity: 1, taxTableId: 'hst' } as never,
  ];
  MOCK_CART.reservations = [{ internalId: 'booking-1', name: 'Beard trim', price: 2000, total: 2000 } as never];
  MOCK_CART.customSales = [{ id: 'cs-1', name: 'Tip jar', applyTaxes: true, quantity: 1, price: 500 } as never];
};

const lines = () => [...MOCK_CART.products, ...(MOCK_CART.reservations ?? []), ...(MOCK_CART.customSales ?? [])];

describe('setTaxOverride action', () => {
  it('calls commandFrameClient with setTaxOverride and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await setTaxOverride({ internalId: 'line-cut', taxOff: true, note: 'Status card' });

    expect(mockCall).toHaveBeenCalledWith('setTaxOverride', {
      internalId: 'line-cut',
      taxOff: true,
      note: 'Status card',
    });
  });
});

describe('setTaxOverride mock', () => {
  beforeEach(seedCart);

  it('turns tax off on one line, recorded as not charged by staff, and getCurrentCart shows it', async () => {
    const response = await mockSetTaxOverride({ internalId: 'line-cut', taxOff: true, note: '  Status card  ' });

    expect(response).toMatchObject({ success: true, internalId: 'line-cut', taxOff: true });
    expect(response.taxOverride).toMatchObject({
      type: 'not_charged',
      source: 'staff',
      userId: MOCK_USER.id,
      stationId: MOCK_STATION._id,
      note: 'Status card',
    });

    const { cart } = await mockGetCurrentCart();
    expect(cart.products[0].taxOverride?.type).toBe('not_charged');
    expect(cart.products[1].taxOverride).toBeUndefined();
    expect(cart.taxOverride).toBeUndefined();
  });

  it('reaches bookings and custom sales by their ids', async () => {
    await mockSetTaxOverride({ internalId: 'booking-1', taxOff: true });
    await mockSetTaxOverride({ internalId: 'cs-1', taxOff: true });

    expect(MOCK_CART.reservations![0].taxOverride?.source).toBe('staff');
    expect(MOCK_CART.customSales![0].taxOverride?.source).toBe('staff');
    // Turning tax off never rewrites what the custom sale asked for.
    expect(MOCK_CART.customSales![0].applyTaxes).toBe(true);
  });

  it('turns tax back on for a line', async () => {
    await mockSetTaxOverride({ internalId: 'line-cut', taxOff: true });
    const response = await mockSetTaxOverride({ internalId: 'line-cut', taxOff: false });

    expect(response.taxOverride).toBeNull();
    expect(MOCK_CART.products[0].taxOverride).toBeUndefined();
  });

  it('turns tax off for the whole sale, on the cart and every line, and back on for all of them', async () => {
    const off = await mockSetTaxOverride({ taxOff: true });

    expect(off.internalId).toBeNull();
    expect(MOCK_CART.taxOverride?.type).toBe('not_charged');
    expect(lines().every((line) => line.taxOverride?.type === 'not_charged')).toBe(true);

    await mockSetTaxOverride({ taxOff: false });

    expect(MOCK_CART.taxOverride).toBeUndefined();
    expect(lines().every((line) => line.taxOverride === undefined)).toBe(true);
  });

  it('taxing one line again ends whole-sale mode and leaves the other lines untaxed', async () => {
    await mockSetTaxOverride({ taxOff: true });
    await mockSetTaxOverride({ internalId: 'line-wax', taxOff: false });

    expect(MOCK_CART.taxOverride).toBeUndefined();
    expect(MOCK_CART.products[1].taxOverride).toBeUndefined();
    expect(MOCK_CART.products[0].taxOverride?.type).toBe('not_charged');
  });

  it('drops a blank note and refuses one over 500 characters', async () => {
    const blank = await mockSetTaxOverride({ internalId: 'line-cut', taxOff: true, note: '   ' });
    expect(blank.taxOverride).not.toHaveProperty('note');

    await expect(mockSetTaxOverride({ internalId: 'line-cut', taxOff: true, note: 'x'.repeat(501) })).rejects.toThrow(
      'longer than 500 characters',
    );
  });

  it('refuses an unknown line and a missing taxOff', async () => {
    await expect(mockSetTaxOverride({ internalId: 'nope', taxOff: true })).rejects.toThrow(
      'no cart line with internalId "nope"',
    );
    await expect(mockSetTaxOverride({ internalId: 'line-cut' } as never)).rejects.toThrow('taxOff must be true');
  });
});
