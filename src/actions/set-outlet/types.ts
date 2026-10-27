// Set Outlet Types
//
// Choose which of the company's locations this shop is ordering from.
//
// WHAT IT ACTUALLY CHANGES. An outlet decides three things, and a shop that lets
// a shopper pick one has to move all three together:
//
//   tax           rates follow the outlet's own address, so the total moves
//   availability  stock is counted per location, and a product can be hidden at one
//   fulfilment    the order records where the goods come from, so the right
//                 location's stock is the one that is drawn down
//
// So this is not a display preference. It re-pulls the catalog for the new
// location, re-hydrates the tax tables, and re-prices the cart. The totals a
// flow reads afterwards are the new location's.
//
// SAFE MID-CHECKOUT. Checkout starts when a shopper ARRIVES, so by the time
// anyone changes their mind an order usually already exists. That order is
// re-priced and moved to the new outlet in place, keeping its id and its receipt
// id, rather than being abandoned and replaced.

export interface SetOutletParams {
  /** An `id` from `getOutlets`. */
  outletId: string;
}

export interface SetOutletResponse {
  /** The location now in effect. */
  outletId: string;
  /**
   * `true` when the catalog and tax tables were re-pulled for this location.
   *
   * `false` means the switch took effect but the refresh could not reach the
   * server — the shop is running on what it already had cached. Totals may be
   * the previous location's until the next refresh pass lands, so a flow can
   * tell the shopper to try again rather than quietly showing stale tax.
   */
  rehydrated: boolean;
  timestamp: string;
}

/**
 * Switch the shop to another of the company's locations.
 *
 * REFUSES AN OUTLET THAT CANNOT TAKE A PAYMENT, and one that does not belong to
 * this company, rather than letting either fail later at the payment step. Check
 * `connected` from `getOutlets` and do not offer those, so this refusal is a
 * backstop rather than something a shopper ever sees.
 *
 * The cart survives the switch. Its lines are kept and re-priced; a line that is
 * not purchasable at the new location is not silently dropped here, it is
 * reported when the checkout is next priced.
 */
export type SetOutlet = (params: SetOutletParams) => Promise<SetOutletResponse>;
