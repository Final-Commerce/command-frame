import type { CFOrder, CFActiveCart } from '../../CommonTypes';
import type { CFStatePair, CFTransitionResult } from '../../common-types/order-state';

// Load Order Into Cart Types
export interface LoadOrderIntoCartParams {
  /** The saved order to put on the till. Must be till-eligible: payment unpaid/partially_paid and fulfillment not cancelled. */
  orderId: string;
  /**
   * Optional fulfillment target applied BEFORE hydration (e.g. 'draft' when resuming an unpaid
   * parked order, 'in_progress' for a deposit-carrying one — 'draft' is blocked once money has
   * been captured). A blocked move aborts the whole load; nothing is hydrated and any edit-rights
   * claim taken is released. Omit to load without changing state.
   */
  targetFulfillmentState?: string;
  /**
   * Same-station policy: the till already holding cart content is an error unless this is true.
   * Default false.
   */
  overwrite?: boolean;
}

/** Who holds edit rights on the order (the cart lease). Populated once the occupancy follow-up ships. */
export interface LoadOrderIntoCartLeaseInfo {
  stationId: string;
  userId?: string;
  claimedAt: string;
  expiresAt: string;
  /** True when this station is the holder. */
  heldByThisStation: boolean;
}

export interface LoadOrderIntoCartResponse {
  success: boolean;
  /** The loaded order (post-transition when a target was applied). */
  order: CFOrder;
  /**
   * The hydrated till state — full cart context: line items, custom sales, cart fees, discounts,
   * notes, split/partial-payment state + remaining balance, customer, and signature.
   */
  cart: CFActiveCart;
  /**
   * True when this till holds edit rights. The lease is an edit lock only: a foreign hold never
   * blocks loading, viewing, payment, or state transitions — only content modification.
   */
  editable: boolean;
  /** Present when a lease exists on the order (own or foreign). Absent until the occupancy follow-up ships. */
  lease?: LoadOrderIntoCartLeaseInfo;
  /** Present when targetFulfillmentState was passed: the transition verdict (and result states when applied). */
  transition?: {
    result: CFTransitionResult;
    from?: CFStatePair;
    to?: CFStatePair;
    displayState?: string;
  };
  timestamp: string;
}

export type LoadOrderIntoCart = (params: LoadOrderIntoCartParams) => Promise<LoadOrderIntoCartResponse>;
