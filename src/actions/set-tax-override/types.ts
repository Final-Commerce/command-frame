import type { CFTaxOverride } from '../../CommonTypes';

/** Longest note accepted (common's `TAX_OVERRIDE_NOTE_MAX`). */
export const SET_TAX_OVERRIDE_NOTE_MAX = 500;

export interface SetTaxOverrideParams {
  /**
   * The cart line to change: a product's or a booking's `internalId`, or a custom sale's `id` (as
   * `getCurrentCart` returns them). Omit to change the whole sale.
   */
  internalId?: string;
  /**
   * `true` turns all tax off (recorded as `not_charged`, by staff), `false` turns it back on.
   *
   * - One line off: only that line (with its modifiers, fees and components) is untaxed.
   * - Whole sale off: every line, booking, custom sale, cart fee and the shipping are untaxed, and lines
   *   added afterwards come in untaxed too.
   * - Whole sale on: clears every override in the sale.
   * - One line on while the whole sale is off: that line is taxed again and the sale leaves whole-sale
   *   mode; the other lines stay untaxed.
   *
   * With tax-inclusive prices the price paid does not change (the shop absorbs the tax); with
   * tax-exclusive prices the total drops by the tax.
   */
  taxOff: boolean;
  /** Optional free text kept with the record, at most 500 characters. Never required. Ignored when turning tax on. */
  note?: string;
}

export interface SetTaxOverrideResponse {
  success: boolean;
  /** The line that changed, or null for the whole sale. */
  internalId: string | null;
  taxOff: boolean;
  /**
   * The record now on the line or the sale — type, source, who, when, which station, note — or null when
   * tax is back on.
   */
  taxOverride: CFTaxOverride | null;
  timestamp: string;
}

/**
 * Turn all tax off, or back on, for one cart line or the whole sale (FT-315).
 *
 * Only before payment: once the cart's order has any payment on it the host refuses, as every
 * value-changing cart command does (`getCurrentCart().itemsLocked`). Read the result back with
 * `getCurrentCart()`: each untaxed line carries `taxOverride`, the cart carries one in whole-sale mode,
 * and the totals are already recalculated. The host publishes cart `tax-override-changed`.
 */
export type SetTaxOverride = (params: SetTaxOverrideParams) => Promise<SetTaxOverrideResponse>;
