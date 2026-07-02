export * from "./common-types";

// command-frame defines NO domain types of its own: every CF* data type is an
// alias of the canonical shape in @final-commerce-public/common/pos-types (single
// source of truth). Where command-frame's own code used an older/diverged shape,
// it has been updated to the canonical one. Only command-frame's integration-
// specific types (CFContext*, CFOutletInfo, CFProjectName, refund-UI state) and
// the enums are defined locally.
import type {
    Tax,
    Tip,
    Address,
    MetadataItem,
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
    CustomerNote,
    Attribute,
    AttributeOption,
    Category,
    Transaction
} from "@final-commerce-public/common/pos-types";

// Enums — re-exported from common (single source). CurrencyCode keeps its name;
// CFProductType/CFUserTypes alias common's ProductType/UserTypes. Note: common's
// UserTypes uses `COMPANY_OWNER` where command-frame's enum previously had `OWNER`
// (same value `'owner'`).
export { CurrencyCode, ProductType as CFProductType, UserTypes as CFUserTypes } from "@final-commerce-public/common";

// ---------------------------------------------------------------------------
// Domain types — all aliases of @final-commerce-public/common/pos-types.
// ---------------------------------------------------------------------------

/** Open record used as a base for active entities. */
export type CFActiveEntity = Record<string, unknown>;

export type CFDiscount = Discount;
export type CFCustomFee = CustomFee;
export type CFAddress = Address;
export type CFMetadataItem = MetadataItem;
export type CFTax = Tax;
export type CFCartFeeTaxEntry = CartFeeTaxEntry;
export type CFInventory = Inventory;
export type CFCustomerNote = CustomerNote;
export type CFOrderNote = OrderNote;
export type CFAttributeOption = AttributeOption;
export type CFAttribute = Attribute;
export type CFTransaction = Transaction;
export type CFCategory = Category;
export type CFProductVariant = ProductVariant;
export type CFProduct = FullProduct;
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
export type CFTileType = "empty" | "product" | "action" | "category" | "folder" | "back";

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
export type CFProjectName = "Render" | "Manage";

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
    buildId: string | null;
    buildName: string | null;
    buildVersion: string | null;
    buildSourceId: string | null;
    buildIsPremium: boolean;
    isOffline: boolean;
    currency: string | null;
    currencySymbol: string | null;
    currencyPrefix: string | null;
    currencySuffix: string | null;
    thousandSeparator: string | null;
    decimalSeparator: string | null;
    user: Record<string, unknown> | null;
    company: Omit<Record<string, unknown>, "settings"> | null;
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
