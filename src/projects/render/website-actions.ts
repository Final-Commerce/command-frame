import type { RenderProviderActions } from './types';

/**
 * The commands a flow can call when it is published as a public website (the storefront channel).
 * Any other command throws "not available on the storefront channel" there. The same flow can be
 * deployed as a POS app or a website, so anything a shopper uses must stick to this list.
 *
 * The flow-facing source of truth: kaching's storefront allowlist is checked against it, and Flow's
 * prompt lists these names from it. Per-field website limits live on each command's own params
 * (see `GetProductsParams.limit`).
 */
export const WEBSITE_ACTIONS = [
  'getContext',
  'getFinalContext',
  'getActiveOutlet',
  'getOutlets',
  'setOutlet',
  'getProducts',
  'getCategories',
  'getTaxTables',
  'getActiveProduct',
  'setActiveProduct',
  'getCurrentCart',
  'addProductToCart',
  'removeProductFromCart',
  'updateCartItemQuantity',
  'clearCart',
  'addProductNote',
  'getProductModifierSelections',
  'setProductModifierSelections',
  'getCompositePrice',
  'getCompositeAvailability',
  'getBookingAvailability',
  'getBookingRentalEnds',
  'addBookingToCart',
  'removeBookingFromCart',
  'getAddressOptions',
  'setOrderAddress',
  'getShippingOptions',
  'selectShippingOption',
  'getCashRoundingAmount',
  'startCheckout',
  'attachCheckoutContact',
  'resumeCheckout',
  'getCheckoutStatus',
  'getShopperAccount',
  'requestShopperCode',
  'signInShopper',
  'signOutShopper',
  'getShopperOrders',
  'getShopperOrder',
  'searchAddresses',
  'getAddressDetails',
] as const satisfies readonly (keyof RenderProviderActions)[];

/**
 * The website commands that exist ONLY on a website: a POS throws "not available on the POS channel"
 * for them. Online checkout, shopper accounts, the store picker and address lookup.
 */
export const WEBSITE_ONLY_ACTIONS = [
  'setOutlet',
  'startCheckout',
  'resumeCheckout',
  'attachCheckoutContact',
  'getCheckoutStatus',
  'getShopperAccount',
  'requestShopperCode',
  'signInShopper',
  'signOutShopper',
  'getShopperOrders',
  'getShopperOrder',
  'searchAddresses',
  'getAddressDetails',
] as const satisfies readonly WebsiteAction[];

export type WebsiteAction = (typeof WEBSITE_ACTIONS)[number];
