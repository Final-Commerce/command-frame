import type { ShippingNoOptionReason, ShippingOptionType } from '@final-commerce/common';

// Get Shipping Options Types
//
// What the cart's shipping address can choose, priced for this cart and ready to
// show. The flow renders it and computes nothing: names, prices, "Free", the amount
// left to free shipping and arrival dates all come from the runtime.
//
// Reads the cart's own shipping address (`setOrderAddress`) and the channel it runs
// on, so it takes no parameters. The till never sees pickup or website-only options.
//
// Served by the till and by the storefront runtime.

export interface ShippingPickupView {
  outletId: string;
  /** The store's name, e.g. "Duckworth Street". */
  name: string;
  /** One line per open day, e.g. "Mon–Fri 9:00 AM – 6:00 PM". Empty when the store set no hours. */
  hours: string[];
}

export interface ShippingOptionView {
  optionId: string;
  type: ShippingOptionType | `${ShippingOptionType}`;
  /** "Standard shipping", or "Pickup at Duckworth Street". */
  name: string;
  /** What this option costs on this cart, minor units, before its tax. */
  amount: number;
  /** "$10.00" or "Free". */
  priceText: string;
  /** "Add $20.00 more for free shipping", when a free-shipping line exists and isn't reached. */
  freeShippingHint: string | null;
  /** "Arrives Tue, Oct 20 – Fri, Oct 23", counted in business days from today. Null for pickup. */
  arrivalText: string | null;
  pickup: ShippingPickupView | null;
  /** The option on the cart now. The cheapest is chosen by default. */
  selected: boolean;
}

export interface GetShippingOptionsResponse {
  /**
   * False when this store doesn't ship at all (no shipping set up) or the cart has
   * nothing to ship: show no shipping step.
   */
  required: boolean;
  /** Ship options cheapest first, then pickups. */
  options: ShippingOptionView[];
  /** Why there is nothing to choose; null when `options` isn't empty. */
  reason: ShippingNoOptionReason | `${ShippingNoOptionReason}` | null;
  /**
   * What to tell the customer: the store's "we don't ship here" message, or the
   * default for the reason ("Sorry, we only ship within Canada."). Null when there are options.
   */
  message: string | null;
  timestamp: string;
}

export type GetShippingOptions = () => Promise<GetShippingOptionsResponse>;
