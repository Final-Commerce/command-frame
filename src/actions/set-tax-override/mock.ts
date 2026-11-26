import type { SetTaxOverride, SetTaxOverrideParams, SetTaxOverrideResponse } from './types';
import { SET_TAX_OVERRIDE_NOTE_MAX } from './types';
import type { CFTaxOverride } from '../../CommonTypes';
import { MOCK_CART, MOCK_STATION, MOCK_USER, mockPublishEvent, safeSerialize } from '../../demo/database';

type OverridableLine = { taxOverride?: CFTaxOverride };

/** Every line of the demo cart that can carry an override: products, bookings, custom sales — keyed as getCurrentCart returns them. */
const cartLines = (): { key: string; line: OverridableLine }[] => [
  ...MOCK_CART.products.map((line) => ({ key: line.internalId ?? line.id, line })),
  ...(MOCK_CART.reservations ?? []).map((line) => ({ key: line.internalId, line })),
  ...(MOCK_CART.customSales ?? []).map((line) => ({ key: line.id, line })),
];

/**
 * The demo host records the override exactly where the real host does (each line, and the cart in
 * whole-sale mode) so a flow can render it, but — like every other mock — it computes no tax.
 */
export const mockSetTaxOverride: SetTaxOverride = async (
  params: SetTaxOverrideParams,
): Promise<SetTaxOverrideResponse> => {
  console.log('[Mock] setTaxOverride called', params);

  if (!params || typeof params.taxOff !== 'boolean') {
    throw new Error('setTaxOverride: taxOff must be true (turn tax off) or false (turn it back on)');
  }
  const note = typeof params.note === 'string' ? params.note.trim() : '';
  if (note.length > SET_TAX_OVERRIDE_NOTE_MAX) {
    throw new Error(`setTaxOverride: note is longer than ${SET_TAX_OVERRIDE_NOTE_MAX} characters`);
  }

  const timestamp = new Date().toISOString();
  const record: CFTaxOverride | null = params.taxOff
    ? {
        type: 'not_charged',
        source: 'staff',
        userId: MOCK_USER?.id ?? null,
        at: timestamp,
        stationId: MOCK_STATION?._id ?? null,
        ...(note ? { note } : {}),
      }
    : null;

  const internalId = params.internalId ?? null;
  const lines = cartLines();

  if (internalId === null) {
    if (record) MOCK_CART.taxOverride = record;
    else delete MOCK_CART.taxOverride;
    for (const { line } of lines) {
      if (record) line.taxOverride = { ...record };
      else delete line.taxOverride;
    }
  } else {
    const target = lines.find((entry) => entry.key === internalId);
    if (!target) {
      throw new Error(
        `setTaxOverride: no cart line with internalId "${internalId}". Pass a product's or booking's internalId, ` +
          `or a custom sale's id, as getCurrentCart returns them; omit internalId for the whole sale.`,
      );
    }
    if (record) {
      target.line.taxOverride = record;
    } else {
      delete target.line.taxOverride;
      // A line taxed again means the sale is no longer untaxed as a whole.
      delete MOCK_CART.taxOverride;
    }
  }

  mockPublishEvent('cart', 'tax-override-changed', {
    internalId,
    taxOverride: record,
    cart: safeSerialize(MOCK_CART),
  });

  return { success: true, internalId, taxOff: params.taxOff, taxOverride: record, timestamp };
};
