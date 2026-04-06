export * from "./common-types";

export enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    CAD = "CAD",
    AUD = "AUD",
    NZD = "NZD",
    CHF = "CHF",
    CNY = "CNY",
    INR = "INR",
    MXN = "MXN",
    BRL = "BRL",
    ZAR = "ZAR",
    SGD = "SGD",
    HKD = "HKD",
    SEK = "SEK",
    NOK = "NOK",
    DKK = "DKK",
    PLN = "PLN",
    THB = "THB",
    MYR = "MYR",
    PHP = "PHP",
    IDR = "IDR",
    AED = "AED",
    SAR = "SAR",
    ILS = "ILS",
    TRY = "TRY",
    RUB = "RUB",
    JPY = "JPY",
    KRW = "KRW",
    VND = "VND",
    CLP = "CLP",
    ISK = "ISK",
    HUF = "HUF",
    TWD = "TWD",
    KWD = "KWD",
    BHD = "BHD",
    OMR = "OMR",
    JOD = "JOD",
    TND = "TND",
    LYD = "LYD",
    IQD = "IQD",
}

// Enums
export enum CFProductType {
    SIMPLE = "simple",
    VARIABLE = "variable"
}

export enum CFUserTypes {
    OWNER = "owner",
    ORG_USER = "organization_user",
    ORG_OWNER = "organization_owner",
    FINAL_USER = "final_user",
    FINAL_OWNER = "final_owner",
    EMPLOYEE = "employee",
    SUPER_ADMIN = "super_admin",
    MANAGER = "manager",
    ADMIN = "admin",
    ASSISTANT_MANAGER = "assistant",
    CASHIER = "cashier",
    RESELLER = "reseller"
}

// Helper Interfaces
export interface CFActiveEntity {}

export interface CFDiscount {
    value: number;
    label?: string;
    isPercent?: boolean;
}

export interface CFCustomFee {
    label: string;
    amount: number;
    isPercent: boolean;
    applyTaxes: boolean;
    taxTableId?: string;
}

export interface CFAddress {
    firstName: string;
    lastName: string;
    company?: string | null;
    city: string;
    postCode: string;
    province?: string;
    state?: string;
    country?: string;
    address1: string;
    address2: string;
}

export interface CFMetadataItem {
    key: string;
    value: string;
}

export interface CFTax {
    id: string;
    name: string;
    percentage: number;
    amount: number;
    taxTableName: string;
    taxTableId: string;
}

export interface CFInventory {
    outletId: string;
    stock?: number | null;
    _id?: string;
}

export interface CFCustomerNote {
    createdAt: string;
    message: string;
}

export interface CFOrderNote {
    externalId?: string;
    author?: string;
    note?: string;
    customerNote?: boolean;
    addedByUser?: string;
    dateCreated?: string;
}

// Category Interface
export interface CFCategory {
    _id: string;
    companyId: string;
    externalId: string;
    name: string;
    parentId: null | string;
    __v?: number;
}

// Product Interfaces
export interface CFProductVariant {
    sku: string;
    price: number;
    salePrice: number;
    isOnSale: boolean;
    barcode?: string;
    costPrice?: number;
    manageStock: boolean;
    externalId?: string;
    inventory?: CFInventory[];
    allowBackorder?: boolean;
    images?: string[];
    attributes: {
        name: string;
        value?: string;
    }[];
    metadata?: {
        key: string;
        value: string;
    }[];
    _id: string;
}

export interface CFProduct {
    _id: string;
    companyId?: string;
    externalId?: string;
    taxTable: string;
    name: string;
    description?: string;
    shortDescription?: string;
    images?: string[];
    categories: string[];
    attributes: {
        name: string;
        values: string[];
    }[];
    tags?: string[];
    supplier?: string;
    sku?: string;
    productType: CFProductType;
    variants: CFProductVariant[];

    currency: CurrencyCode;
    minorUnits: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    isDeleted?: boolean;
}

export interface CFActiveProduct extends CFActiveEntity {
    id: string;
    internalId: string;
    externalId: string;
    productExternalId: string;
    variantId: string;
    name: string;
    sku: string;
    price: number;
    images: string[];
    taxTableId: string;
    quantity: number;
    note?: string;
    discount?: CFDiscount;
    description?: string;
    longDescription?: string;
    shortDescription?: string;
    barcodeId?: string;
    stock: number;
    allowBackOrder?: boolean;
    fee?: CFCustomFee;
    isUnlimited?: boolean;
    attributes?: string;
    localQuantity?: number;
}

// Customer Interfaces
export interface CFCustomer {
    _id: string;
    companyId: any;
    externalId?: string;
    email: string;
    firstName: string;
    lastName: string;
    fromOliver?: boolean;
    phone?: string;
    tags?: string[];
    metadata?: Record<string, string>[];
    notes?: CFCustomerNote[];
    billing: CFAddress | null;
    shipping: CFAddress | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface CFActiveCustomer extends CFCustomer {
    id?: string;
}

// Order & Cart Interfaces
export interface CFTip {
    amount: number;
    percentage: number;
}

export interface CFSummary {
    discountTotal: number;
    shippingTotal?: number | null;
    total: number;
    totalTaxes: number;
    subTotal: number;
    taxes: CFTax[];
    tip?: CFTip | null;
    isTaxInclusive: boolean;
    /** Portion of order total that is non-revenue (e.g. gift card load), same string money format as `total` */
    nonRevenueTotal?: string;
}

export interface CFCartDiscountItem {
    label: string;
    amount: number;
    percentage: number;
}

export interface CFCartFeeItem {
    id: string;
    label: string;
    amount: number;
    percentage: number;
    taxTableId?: string;
    tax?: number;
    taxName: string;
}

export interface CFTipPayment {
    amount: number;
    tipTo: string;
    percentage: number;
}

export interface CFRefundedTipPayment {
    amount: number;
    percentage: number;
    transactionId: string;
    tipTo: string;
}

export interface CFPaymentMethod {
    transactionId: string;
    paymentType: string;
    amount: number;
    timestamp: string;
    processor: string;
    saleId?: string;
    change?: number | null;
    tip?: CFTipPayment | null;
    cashRounding?: number;
    emv?: string | null;
}

export interface CFPosDataItem {
    outlet: string;
    station: string;
    employee: string | { _id?: string; firstName: string; lastName: string };
}

export interface CFDiscountDetail {
    percentage: number;
    amount: number;
    label?: string;
}

export interface CFFeeDetail {
    percentage: number;
    amount: number;
    tax: number;
    taxTableId: string;
    label?: string;
}

export interface CFDiscountLineItem {
    itemDiscount: CFDiscountDetail;
    cartDiscount: CFDiscountDetail;
}

export interface CFFeeLineItem {
    itemFee: CFFeeDetail;
    cartFee?: CFFeeDetail;
}

export interface CFLineItem {
    productId: string;
    variantExternalId?: string;
    productExternalId?: string;
    internalId?: string;
    name: string;
    quantity: number;
    price: number;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    fee: CFFeeLineItem;
    totalTax: number;
    total: number;
    metadata: CFMetadataItem[];
    image: string;
    sku: string;
    stock: number;
    note?: string;
    description?: string;
    variantId: string;
    images?: string[];
    attributes?: string;
}

export interface CFCustomSale {
    customSaleId: string;
    name: string;
    price: number;
    quantity: number;
    applyTaxes: boolean;
    total: number;
    totalTax: number;
    taxes: CFTax[];
    discount: {
        cartDiscount: CFDiscountDetail;
    };
    fee: {
        cartFee: CFFeeDetail;
    };
}

export interface CFRefundedLineItem {
    productId: string;
    variantId: string;
    variantExternalId?: string;
    productExternalId?: string;
    internalId?: string;
    name: string;
    quantity: number;
    price: number;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    totalTax: number;
    total: number;
    image: string;
    sku: string;
    note?: string;
    description?: string;
    images?: string[];
    fee: CFFeeLineItem;
}

export interface CFRefundedCustomSale extends CFCustomSale {
    // action: string;
}

export interface CFRefundItem {
    lineItems: CFRefundedLineItem[];
    customSales: CFRefundedCustomSale[];
    cartFees: CFCartFeeItem[];
    tips: CFRefundedTipPayment[];
    refundedBy: string;
    timestamp: string | undefined;
    summary?: CFSummary;
    refundPayment: CFPaymentMethod[];
    balance?: number;
    receiptId?: string;
    currency: CurrencyCode;
    minorUnits: number;
}

export interface CFOrder {
    _id: string;
    currency: CurrencyCode;
    minorUnits: number;
    receiptId?: string;
    companyId: string;
    externalId: string | null;
    status: string;
    customer: Partial<CFActiveCustomer | null>;
    customerNote?: string;
    summary: CFSummary;
    cartDiscount: CFCartDiscountItem | null;
    cartFees: CFCartFeeItem[] | null;
    updatedAt?: string;
    createdAt?: string;
    paymentMethods: CFPaymentMethod[];
    source: string;
    posData: CFPosDataItem | null;
    sessionId: string;
    metadata: CFMetadataItem[];
    notes?: CFOrderNote[] | null;
    billing: CFAddress | null;
    shipping: CFAddress | null;
    lineItems: CFLineItem[];
    customSales: CFCustomSale[];
    /** Gift card / liability purchase lines (not product revenue) */
    nonRevenueItems?: CFNonRevenueItem[];
    refund?: CFRefundItem[];
    balance: number;
    signature?: string | null;
}

export interface CFActiveUserRole {
    id?: string;
    _id?: string;
    companyId?: string;
    name: string;
    permissions: {
        category: string;
        label?: string;
        name: string;
        value: boolean;
        permissionId?: string;
        subCategory?: string;
    }[];
}

export interface CFActiveUser extends CFActiveEntity {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    pincode?: string;
    role: CFActiveUserRole | { _id: string; name: string };
    id: string;
    _id?: string;
    outlets?: string[] | { _id: string }[];
    type?: CFUserTypes;
    companies?: any;
}

export interface CFActiveOutlet extends CFActiveEntity {
    address: string;
    address2: string;
    city: string;
    state: string;
    country?: string;
    taxId: string;
    postCode?: string;
    name?: string;
    stripe?: {
        locationId: string;
    };
    id: string;
    sequenceNumber: number;
    _id?: string;
    stripeAccountId: string;
}

export interface CFActiveStation {
    _id: string;
    sequenceNumber?: number;
    name: string;
    status: string;
    buildSrcId?: string;
    buildVersion?: string;
    publishBuildId?: string;
    createdAt?: string;
    updatedAt?: string;
    stripeTerminalId?: string;
}

export interface CFActiveOrder extends CFOrder {
    id?: string;
    internalId?: string;
    user?: CFActiveUser;
    outlet?: CFActiveOutlet;
    isDeleted?: boolean;
    newOrder?: boolean;
    station?: CFActiveStation;
}

export interface CFActiveCustomSales {
    id: string;
    name: string;
    applyTaxes: boolean;
    taxTableId?: string;
    quantity: number;
    price: number;
    discount?: any;
    fee?: any;
}

/** Non-revenue cart line (e.g. gift card load) — aligned with Render `NonRevenueItem.externalId` (order line id). */
export interface CFNonRevenueItem {
    /** Unique cart/order line id (Mongo-style id from host). Extension reference is usually `metadata.refId`. */
    externalId: string;
    amount: number | string;
    label?: string;
    metadata?: Record<string, unknown>;
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface CFActiveCart extends CFActiveEntity {
    tax?: number;
    total: number;
    subtotal: number;
    discount?: CFDiscount;
    customFee?: CFCustomFee[];
    products: CFActiveProduct[];
    customSales?: CFActiveCustomSales[];
    /** Gift card / liability lines — included in cart total */
    nonRevenueItems?: CFNonRevenueItem[];
    remainingBalance?: number;
    amountToBeCharged: number;
    customer?: Partial<CFCustomer | null> | null;
    orderNotes?: string;
    cartTotal?: number;
    orderTotal?: number;
    orderId?: string;
}

export interface CFActiveCompany extends CFActiveEntity {
    id?: string;
    name?: string;
    logo?: string;
    settings?: any;
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
    user: Record<string, any> | null;
    company: Omit<Record<string, any>, 'settings'> | null;
    station: Record<string, any> | null;
    outlet: Record<string, any> | null;
    timestamp: string;
}

// Outlet info for Manage context
export interface CFOutletInfo {
    _id?: string;
    id?: string;
    name: string;
    address?: string | {
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
    user: any;
    company: any;
    menuItem?: any;
    extensionId: string;
    outlets?: any[];
    timestamp: string;
}

// Legacy alias for backward compatibility
export type CFContext = CFContextRender;
