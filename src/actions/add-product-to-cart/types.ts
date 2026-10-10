// Add Product To Cart Types
import type { AddProductDiscountParams } from '../add-product-discount/types';
import type { AddProductFeeParams } from '../add-product-fee/types';
import type { ModifierSelection } from '../get-product-modifier-selections/types';
import type { CFCompositePick, CFProdModifierBreakdown } from '../../CommonTypes';

export interface AddProductToCartParams {
  /** ID of the variant to add. */
  variantId: string;
  /**
   * Defaults to 1. **May be fractional** — a variant sold by weight, volume or length is priced
   * per its own unit and keyed in that unit, so `0.456` kg is a quantity, not a typo.
   *
   * How many decimals are allowed is the variant's own business: `variant.unit.precision` —
   * `3` for a litre, `0` for anything sold by the piece. The engine refuses a quantity finer
   * than that and says which unit it was measured against; do not round, floor or clamp before
   * sending, and never key a quantity in base units to work around it (a per-100g price with a
   * gram count is explicitly not supported).
   *
   * A quantity field should take its step and its decimal count from `variant.unit.precision`,
   * not from a constant.
   */
  quantity?: number;
  /** Array of discounts to apply immediately. */
  discounts?: AddProductDiscountParams[];
  /** Array of fees to apply immediately. */
  fees?: AddProductFeeParams[];
  /** Modifier selections to apply immediately. */
  modifiers?: ModifierSelection[];
  /**
   * Picks for a composite product (`CFProduct.composite`), validated by the host against each part's
   * required / min / max, availability and each picked item's own modifier rules before the line exists; a
   * rejected add returns `success: false` with a `reason`. Refused for a product that is not a composite.
   *
   * `composite[].modifiers` are the PICKED ITEM's modifiers (`choices[].modifiers`), taxed at that item's table
   * (B28); send their quantity per one pick — the host multiplies it by the pick's units. The line comes back with
   * `components[]` and those rows in its flat `modifiers[]` with `componentIndex`.
   *
   * A composite has no modifiers of its own (B43): `modifiers` sent with `composite` are refused — every modifier of a
   * composite line is a picked item's and carries `componentIndex`. A taxable `fee` on a composite taxed by its items is
   * refused too: there is no table for it to inherit.
   */
  composite?: CFCompositePick[];
  /**
   * B41: REQUIRED when `composite.needsDate` is true — the ONE date and time every bookable pick of this composite is
   * booked for: show a date and time picker and send the `startAt` of a slot `getCompositeAvailability` offered. Without
   * it the add is refused with a `reason`; if a seat went meanwhile, ask availability again — never retry the same slot.
   * The host checks goods stock, then seats, then holds each bookable in one step: any failure releases what it
   * took and the add is refused with a `reason`. Each hold lands in `cart.reservations[]` at price 0, linked to the line
   * (`lineItemInternalId`, `componentIndex`); the component carries the money. Such a line's quantity cannot be
   * changed, and it is refunded whole only.
   */
  compositeSlot?: { startAt: string };
  /** Note or array of notes to add immediately. */
  notes?: string | string[];
}

export interface AddProductToCartResponse {
  success: boolean;
  /** Set when the add was rejected (e.g. a required modifier is unanswered, or `Marked unavailable` at this outlet). */
  reason?: string;
  productId: string;
  variantId: string;
  /** The unique identifier for the specific item instance added to the cart. */
  internalId: string;
  name: string;
  quantity: number;
  /** The modifiers the line was created with, display-ready. Empty when there are none. */
  rows: CFProdModifierBreakdown[];
  /** Sum of `rows[].amount` — what the modifiers added to this line, in minor units. */
  modifiersTotal: number;
  timestamp: string;
}

export type AddProductToCart = (params?: AddProductToCartParams) => Promise<AddProductToCartResponse>;
