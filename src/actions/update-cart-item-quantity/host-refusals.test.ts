import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReservationStatus } from '@final-commerce/common';
import {
  MOCK_BOOKINGS,
  MOCK_CART,
  MOCK_PRODUCT_BASIL_ALMOND,
  MOCK_PRODUCT_HAIRCUT,
  MOCK_PRODUCT_PASTE_TRIO,
  resetMockCart,
} from '../../demo/database';
import { mockUpdateCartItemQuantity } from './mock';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockAddBookingToCart } from '../add-booking-to-cart/mock';
import { mockSetVariantUnavailable } from '../set-variant-unavailable/mock';
import { mockGetCompositeAvailability } from '../get-composite-availability/mock';

// The mocks refuse like the kaching host, with its texts, or a flow is built around behaviour the device does not have.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const bookingsBefore = MOCK_BOOKINGS.length;
afterEach(() => {
  MOCK_BOOKINGS.splice(bookingsBefore);
  resetMockCart();
});

describe('updateCartItemQuantity mock mirrors the host', () => {
  it('a line holding bookings keeps its quantity; removing it drops and releases its holds', async () => {
    const line = await mockAddProductToCart({ variantId: MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id });
    await mockAddBookingToCart({
      productId: MOCK_PRODUCT_HAIRCUT._id ?? '',
      resourceId: 'res_room_1',
      startAt: '2099-01-01T10:00:00.000Z',
      endAt: '2099-01-01T10:30:00.000Z',
    });
    for (const reservation of MOCK_CART.reservations ?? []) reservation.lineItemInternalId = line.internalId;
    expect(MOCK_CART.reservations).toHaveLength(1);

    expect(() => mockUpdateCartItemQuantity({ internalId: line.internalId, quantity: 2 })).toThrow(
      `${MOCK_PRODUCT_BASIL_ALMOND.name} holds a booking — its quantity is the seats held: remove the line and add it again with the new quantity (addProductToCart with compositeSlot)`,
    );
    await expect(mockUpdateCartItemQuantity({ internalId: line.internalId, quantity: 0 })).resolves.toMatchObject({
      success: true,
      quantity: 0,
    });
    expect(MOCK_CART.reservations).toEqual([]);
    expect(MOCK_BOOKINGS.at(-1)?.status).toBe(ReservationStatus.CANCELLED);
  });

  it('raising a composite line past a component shelf is refused — "only N left"; lowering is not', async () => {
    const shelf = MOCK_PRODUCT_BASIL_ALMOND.variants[0].inventory?.[0];
    if (!shelf) throw new Error('demo basil has no shelf');
    const before = shelf.stock;
    shelf.stock = 1;
    try {
      const line = await mockAddProductToCart({
        variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id,
        composite: [
          { itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' },
          { itemId: 'item_spicy', variantId: 'prod_habanero_var_main' },
        ],
      });
      expect(line.success).toBe(true);
      expect(() => mockUpdateCartItemQuantity({ internalId: line.internalId, quantity: 2 })).toThrow(
        'Basil Almond Paste: only 1 left',
      );
      await expect(mockUpdateCartItemQuantity({ internalId: line.internalId, quantity: 1 })).resolves.toMatchObject({
        success: true,
      });
    } finally {
      shelf.stock = before;
    }
  });
});

describe('refusals resolve, they do not throw', () => {
  it('setVariantUnavailable: unavailable must be a boolean; unknown variant', async () => {
    const variantId = MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id;
    await expect(mockSetVariantUnavailable({ variantId, unavailable: JSON.parse('"yes"') })).resolves.toMatchObject({
      success: false,
      reason: 'variantId and unavailable are required',
    });
    expect(MOCK_PRODUCT_BASIL_ALMOND.variants[0].unavailable).not.toBe('yes');
    await expect(mockSetVariantUnavailable({ variantId: 'nope', unavailable: true })).resolves.toMatchObject({
      success: false,
      reason: 'Variant with ID nope not found',
    });
  });

  it('getCompositeAvailability: unknown variant', async () => {
    await expect(mockGetCompositeAvailability({ variantId: 'nope' })).resolves.toMatchObject({
      success: false,
      reason: 'Variant with ID nope not found',
      slots: [],
      timeZone: null,
    });
  });
});
