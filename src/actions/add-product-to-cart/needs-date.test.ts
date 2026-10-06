import { describe, it, expect } from 'vitest';
import { mockNeedsDateRefusal } from './mock';

// B41: the mock refuses a composite with a booking sold without a slot, word for word as the host (kaching
// `loadCompositeLine`) — a preview that sells it would teach a flow to skip the calendar.
describe('a composite with a bookable item needs compositeSlot', () => {
  const composite = { needsDate: true } as never;
  it("refuses without a slot, in the host's words", () => {
    expect(mockNeedsDateRefusal('Boat Trip + T-shirt', composite)).toBe(
      'Boat Trip + T-shirt includes a booking: show a date and time picker (getCompositeAvailability) and pass compositeSlot to addProductToCart',
    );
  });
  it('accepts a slot, and never asks a composite of goods for one', () => {
    expect(mockNeedsDateRefusal('Boat Trip + T-shirt', composite, { startAt: '2026-10-04T13:00:00.000Z' })).toBeNull();
    expect(mockNeedsDateRefusal('MackMenu', { needsDate: false } as never)).toBeNull();
  });
});
