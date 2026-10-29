export * from './common-types';

// command-frame defines NO domain types of its own: every CF* data type is an
// alias of the canonical shape in @final-commerce/common/pos-types (single
// source of truth). Where command-frame's own code used an older/diverged shape,
// it has been updated to the canonical one. Only command-frame's integration-
// specific types (CFContext*, CFOutletInfo, CFProjectName, refund-UI state) and
// the enums are defined locally.
import type {
  Tax,
  Tip,
  Address,
  MetadataItem,
  OrderAssignedUser,
  OrderInCart,
  OrderCustomStatus,
  PosDataItem,
  CartFeeTaxEntry,
  CartFeeItem,
  CartDiscountItem,
  OrderNote,
  NonRevenueItem,
  DiscountDetail,
  FeeDetail,
  DiscountLineItem,
  FeeLineItem,
  LineItem,
  TipPayment,
  RefundedTipPayment,
  PaymentMethod,
  Discount,
  CustomFee,
  Summary,
  CustomSale,
  RefundedCustomSale,
  RefundItem,
  RefundedLineItem,
  ActiveStation,
  ActiveSession,
  ActiveOutlet,
  ActiveUser,
  ActiveUserRole,
  ActiveOrder,
  ActiveCart,
  ActivePark,
  ActiveCompany,
  ActiveCustomSales,
  ActiveProduct,
  ActiveCustomer,
  FullProduct,
  ProductVariant,
  Inventory,
  ResolvedModifier,
  ResolvedModifierChoice,
  ModifierSelectionType,
  ModifierSelection,
  ModifierChoiceSelection,
  CartLineModifier,
  ProdModifierBreakdown,
  OrderLineItemModifier,
  CustomerNote,
  Attribute,
  AttributeOption,
  Category,
  Transaction,
  ActiveSplitPayment,
  BookingAvailability,
  BookingSlot,
  BookingSlotResource,
  BookingResource,
  Booking,
  CartReservation,
  OrderReservation,
  Composite,
  CompositePart,
  CompositeItem,
  CompositeChoice,
  CompositeItemUnavailable,
  CompositePick,
  CartLineComponent,
  OrderLineItemComponent,
} from '@final-commerce/common/pos-types';

// Enums — re-exported from common (single source). CurrencyCode keeps its name;
// CFProductType/CFUserTypes alias common's ProductType/UserTypes. Note: common's
// UserTypes uses `COMPANY_OWNER` where command-frame's enum previously had `OWNER`
// (same value `'owner'`).
export { CurrencyCode, ProductType as CFProductType, UserTypes as CFUserTypes } from '@final-commerce/common';

// ---------------------------------------------------------------------------
// Domain types — all aliases of @final-commerce/common/pos-types.
// ---------------------------------------------------------------------------

/** Open record used as a base for active entities. */
export type CFActiveEntity = Record<string, unknown>;

export type CFDiscount = Discount;
export type CFCustomFee = CustomFee;
export type CFAddress = Address;
export type CFMetadataItem = MetadataItem;
export type CFOrderAssignedUser = OrderAssignedUser;
export type CFOrderInCart = OrderInCart;
export type CFOrderCustomStatus = OrderCustomStatus;
export type CFTax = Tax;
export type CFCartFeeTaxEntry = CartFeeTaxEntry;
export type CFInventory = Inventory;
export type CFCustomerNote = CustomerNote;
export type CFOrderNote = OrderNote;
export type CFAttributeOption = AttributeOption;
export type CFAttribute = Attribute;
export type CFTransaction = Transaction;
export type CFCategory = Category;
/**
 * FT-151 `unavailable`: `true` when the variant is marked "can't be sold here right now" at the ACTIVE outlet
 * (`setVariantUnavailable`). Independent of stock; `addProductToCart` refuses it even with backorders. The host always
 * sets it on `getProducts`. INTERIM here until `common/pos-types` ProductVariant carries it (ob_agent).
 */
export type CFProductVariant = ProductVariant & { unavailable?: boolean };
export type CFProduct = Omit<FullProduct, 'variants'> & { variants: CFProductVariant[] };
/** Composite products (FT-83): `CFProduct.composite`, the picks `addProductToCart` takes, the cart/order line's
 *  components. The host decides availability, prices and tax; a flow renders them and sends picks. */
/**
 * B41: `needsDate: true` — the composite holds a bookable item and CANNOT be sold without a time. Show "By date" and a
 * date and time picker filled from `getCompositeAvailability`, then pass the chosen `compositeSlot` to `addProductToCart`.
 * Until a time is chosen its bookable items read `unavailable: 'by_date'` — still pickable, never greyed out.
 * INTERIM here until `common/pos-types` Composite carries it (ob_agent).
 */
export type CFComposite = Composite & { needsDate: boolean };
export type CFCompositePart = CompositePart;
export type CFCompositeItem = CompositeItem;
export type CFCompositeChoice = CompositeChoice;
export type CFCompositeItemUnavailable = CompositeItemUnavailable;
/**
 * B41: `resourceId` — on a bookable pick only: the resource that must serve it. Omitted = the host takes the first one
 * free in that window. INTERIM here until `common/pos-types` CompositePick carries it (ob_agent).
 */
export type CFCompositePick = CompositePick & { resourceId?: string };
export type CFCartLineComponent = CartLineComponent;
export type CFOrderLineItemComponent = OrderLineItemComponent;
export type CFBookingAvailability = BookingAvailability;
export type CFBookingSlot = BookingSlot;
export type CFBookingSlotResource = BookingSlotResource;
export type CFBookingResource = BookingResource;
export type CFBooking = Booking;
/** A service sitting in the cart, and the same sale once it is on an order. A flow that draws a
 *  cart or a receipt needs both by name — reaching into the package's dist for them is not an
 *  interface. */
export type CFCartReservation = CartReservation;
export type CFOrderReservation = OrderReservation;
/** Modifier (the till question) resolved onto a product — `CFProduct.modifiers`. */
export type CFResolvedModifier = ResolvedModifier;
export type CFResolvedModifierChoice = ResolvedModifierChoice;
export type CFModifierSelectionType = ModifierSelectionType;
/** One selected modifier choice on an order line item (wire shape). */
export type CFOrderLineItemModifier = OrderLineItemModifier;
/** Cart-line modifier answer (pre-pricing) — `CFActiveProduct.modifierSelections`. */
export type CFModifierSelection = ModifierSelection;
export type CFModifierChoiceSelection = ModifierChoiceSelection;
/** One selected choice PRICED onto a cart line — `CFActiveProduct.modifiers` (not the resolved stack). */
export type CFCartLineModifier = CartLineModifier;
/** A priced, line-extended modifier row: "Toppings - Avocado" x2, `amount` 1000. */
export type CFProdModifierBreakdown = ProdModifierBreakdown;
export type CFActiveProduct = ActiveProduct;
export type CFCustomer = ActiveCustomer;
export type CFActiveCustomer = ActiveCustomer;
export type CFTip = Tip;
export type CFSummary = Summary;
export type CFCartDiscountItem = CartDiscountItem;
export type CFCartFeeItem = CartFeeItem;
export type CFTipPayment = TipPayment;
export type CFRefundedTipPayment = RefundedTipPayment;
export type CFPaymentMethod = PaymentMethod;
export type CFSplitPayment = ActiveSplitPayment;
export type CFPosDataItem = PosDataItem;
export type CFDiscountDetail = DiscountDetail;
export type CFFeeDetail = FeeDetail;
export type CFDiscountLineItem = DiscountLineItem;
export type CFFeeLineItem = FeeLineItem;
export type CFLineItem = LineItem;
export type CFCustomSale = CustomSale;
export type CFRefundedLineItem = RefundedLineItem;
export type CFRefundedCustomSale = RefundedCustomSale;
export type CFRefundItem = RefundItem;
export type CFOrder = ActiveOrder;
export type CFActiveUserRole = ActiveUserRole;
export type CFActiveUser = ActiveUser;
export type CFActiveOutlet = ActiveOutlet;
export type CFActiveStation = ActiveStation;
export type CFSession = ActiveSession;
export type CFActiveOrder = ActiveOrder;
export type CFActiveCustomSales = ActiveCustomSales;
export type CFNonRevenueItem = NonRevenueItem;
export type CFActiveCart = ActiveCart;
export type CFActivePark = ActivePark;
export type CFActiveCompany = ActiveCompany;

// ---------------------------------------------------------------------------
// command-frame integration-specific types (no common counterpart).
// ---------------------------------------------------------------------------

/** Tile kinds a SmartGrid cell can represent. Mirrors common's `BaseTile['type']`. */
export type CFTileType = 'empty' | 'product' | 'action' | 'category' | 'folder' | 'back';

/**
 * A single positioned cell in a SmartGrid layout. The wire/extension-facing shape
 * (Render's adapter maps this to/from common's `BaseTile`).
 */
export interface CFTileCell {
  /** Position of the cell within its grid (or folder). */
  index: number;
  type: CFTileType;
  /** Entity id the cell points at (product/category/folder id, action key, …). */
  entityId?: string;
  /** Opaque entity payload round-tripped with the cell. */
  entityData?: Record<string, unknown>;
}

/** A builder SmartGrid layout addressed by `gridId`, with optional folder sub-grids. */
export interface CFSmartGridLayout {
  gridId: string;
  cells: CFTileCell[];
  /** Operator-editable display name for the grid. */
  name?: string;
  /** Folder id → its cells. */
  folders?: Record<string, CFTileCell[]>;
}

/** Refund UI / selection state in POS, aligned with Render `ActiveRefundOrder`. */
export interface CFRefundProcessingStatus {
  status: string;
  isCardPresent?: boolean;
  message?: string;
}

export interface CFActiveRefundDetails {
  quantities?: Record<string, number>;
  options?: Record<string, string>;
  refundAmounts?: Record<string, number>;
  refundPayments?: CFPaymentMethod[] | null;
  currentRefundTotal?: number;
  amountRemaining?: number | null;
  buttonsDisabled?: Record<string, boolean>;
  isRefund?: boolean;
  customSalesQuantities?: Record<string, number>;
  cartFeesRefunds?: Record<string, number>;
  tipsRefunds?: Record<string, number>;
  refundProcessingStatus?: CFRefundProcessingStatus | null;
  sessionRefundedTotal?: number;
}

// Project name type for identifying which provider environment is active
export type CFProjectName = 'kaching' | 'Manage';

// Context for Render project (POS terminal context)
export interface CFContextRender {
  userId: string | null;
  companyId: string | null;
  companyName: string | null;
  deviceId: string | null;
  stationId: string | null;
  stationName: string | null;
  outletId: string | null;
  outletName: string | null;
  /**
   * IANA zone the SHOP keeps, resolved as the outlet's own zone, else the
   * company's — never the device's. A booking is stored as an instant, so which
   * hour and which DAY it reads as is decided entirely by the zone it is printed
   * in, and the screen's own machine is the one zone that is certainly wrong: a
   * 17:00 Monday appointment in Vancouver is 21:30 for a till in St John's, and
   * for some viewers it lands on Tuesday. Without this an app cannot label a
   * slot or an appointment honestly — it can only guess, and it guesses wrong
   * for every business that does not sit in the same zone as its screen.
   *
   * `null` when neither the outlet nor the company has one configured. Say so
   * rather than falling back to the device: a missing timezone is a setup
   * problem, and printing the machine's clock hides it.
   */
  timeZone: string | null;
  buildId: string | null;
  buildName: string | null;
  buildVersion: string | null;
  buildSourceId: string | null;
  buildIsPremium: boolean;
  isOffline: boolean;
  currency: string | null;
  /**
   * Number of minor-unit decimals for the company currency (e.g. 2 for USD
   * — $15.75 = 1575 minor units; 0 for JPY). Every money param/response on
   * this API is expressed in integer minor units; use this to convert user
   * input.
   */
  minorUnits: number | null;
  currencySymbol: string | null;
  currencyPrefix: string | null;
  currencySuffix: string | null;
  thousandSeparator: string | null;
  decimalSeparator: string | null;
  user: Record<string, unknown> | null;
  company: Omit<Record<string, unknown>, 'settings'> | null;
  station: Record<string, unknown> | null;
  outlet: Record<string, unknown> | null;
  timestamp: string;
}

// Outlet info for Manage context
export interface CFOutletInfo {
  _id?: string;
  id?: string;
  name: string;
  address?:
    | string
    | {
        address1?: string;
        address2?: string;
        city?: string;
        country?: string;
        state?: string;
        postCode?: string;
      };
  city?: string;
  state?: string;
  country?: string;
}

// Context for Manage/BuilderHub project
export interface CFContextManage {
  user: unknown;
  company: unknown;
  menuItem?: unknown;
  extensionId: string;
  outlets?: unknown[];
  timestamp: string;
}

// Legacy alias for backward compatibility
export type CFContext = CFContextRender;

// ---------------------------------------------------------------------------
// Loyalty (Engage). Engage keeps every programme, balance, reward and coupon;
// the host asks Hub with the sign-in it already holds, Hub asks Engage, and the
// host puts what Engage answers on the cart itself. A flow never sees a token,
// a key or a customer's email or phone. See src/actions/get-loyalty/README.md.
// ---------------------------------------------------------------------------

/** What a reward or an offer takes off. Money is in minor units. */
export interface CFLoyaltyDiscount {
  kind: 'free_item' | 'amount_off' | 'percent_off';
  /** amount_off, minor units. */
  valueMinor: number | null;
  /** percent_off: more than 0, at most 100. The host refuses anything else. */
  percent: number | null;
  /** free_item: one of these is free; percent_off: only these. Any item when empty. */
  productIds: string[];
  /** The most a free item or a percentage may take off, minor units. */
  maxValueMinor: number | null;
  /**
   * A coupon's minimum spend, minor units: what the customer spends on the sale (the subtotal
   * without a gift card loaded on it) has to reach it before the host places the discount, and the
   * host takes it off again if the cart drops under it.
   */
  minSpendMinor?: number | null;
}

export interface CFLoyaltyReward extends CFLoyaltyDiscount {
  id: string;
  name: string;
  /** Stamps or points it takes. */
  cost: number;
  /** On a member: whether their balance pays for it now. */
  available?: boolean;
}

export interface CFLoyaltyProgram {
  id: string;
  name: string;
  kind: 'stamps' | 'points';
  /** paused: nothing earns and nobody joins; rewards already earned can still be used. */
  status: 'live' | 'paused';
  unit: { one: string; many: string };
  rewards: CFLoyaltyReward[];
  card: { title: string; background: string; foreground: string; label: string };
}

/** A coupon waiting on a member's card, or on the sale's customer when they have none (`CFLoyaltyState.offers`). */
export interface CFLoyaltyOffer {
  grantId: string;
  offerId: string;
  name: string;
  code: string;
  discount: CFLoyaltyDiscount;
  minSpendMinor: number | null;
  /** Their own free item, for a coupon for their usual: the discount names only it. */
  item?: { productId: string; name: string } | null;
  /** Goes on a sale beside other coupons. Engage checks it when the coupon is applied. */
  combines?: boolean;
  expiresAt: string | null;
}

/** A member as a till shows them. Never their email or phone. */
export interface CFLoyaltyMember {
  id: string;
  name: string | null;
  /** The nine digits on the card and in its barcode. */
  number: string;
  balance: number;
  /** "7 of 10 stamps", "1,240 points". */
  headline: string;
  /** "3 more stamps for A drink on us", or null. */
  next: string | null;
  rewards: CFLoyaltyReward[];
  offers: CFLoyaltyOffer[];
}

/** A reward or an offer on the cart: held at Engage, its discount on the cart under `label`. */
export interface CFLoyaltyApplied {
  redemptionId: string;
  /**
   * The name of the discount on the cart: the reward's own ("A drink on us"). Engage finds the hold
   * through the order's metadata, `engage.loyalty.<redemptionId>`, which the host writes; a flow
   * leaves those keys alone.
   */
  label: string;
  name: string;
  rewardId: string | null;
  offerId: string | null;
  discount: CFLoyaltyDiscount;
  /** Where it went: the cart's discount, or a discount on the lines in `internalIds`. */
  appliedTo: 'cart' | 'lines';
  internalIds: string[];
  /** The stamps or points go back on their own if the sale isn't done by then. */
  expiresAt: string;
}

/**
 * Who is in front of the screen. Decided on the server, never by the host or the flow: `customer`
 * on a website and on a station the shop marked in Engage as one customers use themselves (a kiosk,
 * a self-checkout), where a card shows only after a code sent to its phone or email came back.
 */
export type CFLoyaltyMode = 'staff' | 'customer';

export interface CFLoyaltyState {
  /** Null when the company has no programme running. */
  program: CFLoyaltyProgram | null;
  /** Coupons are on for this company: the host looks the sale's customer up for theirs, programme or not. */
  coupons?: boolean;
  /** The member on this sale: the cart's customer (staff), a card found or joined on it, or the card a code proved (customer). */
  member: CFLoyaltyMember | null;
  /**
   * Coupons waiting on the sale's customer when they have no card (a member's are on `member.offers`).
   * `applyLoyaltyReward({ grantId })` takes one without a member; they come off the cart if the
   * customer leaves the sale or is swapped.
   */
  offers?: CFLoyaltyOffer[];
  /** The customer on this sale isn't a member and may join. */
  canJoin: boolean;
  mode: CFLoyaltyMode;
  /** Customer mode: a code was sent and is waiting to be typed back (confirmLoyaltyCheck). */
  checkPending: boolean;
  applied: CFLoyaltyApplied[];
}

/** Why a loyalty command said no. Every refusal also carries `reason`, in words for the person in front of the screen. */
export type CFLoyaltyRefusal =
  | 'offline'
  | 'not_live'
  | 'check_needed'
  | 'staff_only'
  | 'not_member'
  | 'no_contact'
  | 'too_many'
  | 'cannot_send'
  | 'wrong_code'
  | 'expired'
  | 'used_up'
  | 'not_found'
  | 'unavailable'
  | 'cart_discount_taken'
  | 'nothing_to_discount'
  | 'bad_request';

/** What every loyalty command answers besides its own fields. */
export interface CFLoyaltyOutcome {
  /** False when the command was refused: `reason` says why, `refusal` says which. */
  success: boolean;
  reason?: string;
  refusal?: CFLoyaltyRefusal;
  timestamp: string;
}
