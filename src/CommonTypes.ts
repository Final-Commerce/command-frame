export * from "./common-types";

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
    amount: string;
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
    price: string;
    salePrice: string;
    isOnSale: boolean;
    barcode?: string;
    costPrice?: string;
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

    minPrice?: string;
    maxPrice?: string;
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
    amount: string;
    percentage: number;
}

export interface CFSummary {
    discountTotal: string;
    shippingTotal?: string | null;
    total: string;
    totalTaxes: string;
    subTotal: string;
    taxes: CFTax[];
    tip?: CFTip | null;
    isTaxInclusive: boolean;
}

export interface CFCartDiscountItem {
    label: string;
    amount: string;
    percentage: number;
}

export interface CFCartFeeItem {
    id: string;
    label: string;
    amount: string;
    percentage: number;
    taxTableId?: string;
    tax?: string;
    taxName: string;
}

export interface CFTipPayment {
    amount: string;
    tipTo: string;
    percentage: number;
}

export interface CFRefundedTipPayment {
    amount: string;
    percentage: number;
    transactionId: string;
    tipTo: string;
}

export interface CFPaymentMethod {
    transactionId: string;
    paymentType: string;
    amount: string;
    timestamp: string;
    processor: string;
    saleId?: string;
    change?: string | null;
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
    amount: string;
    const?: string;
}

export interface CFFeeDetail {
    percentage: number;
    amount: string;
    tax: string;
    taxTableId: string;
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
    price: string;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    fee: CFFeeLineItem;
    totalTax: string;
    total: string;
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
    price: string;
    quantity: number;
    applyTaxes: boolean;
    total: string;
    totalTax: string;
    taxes: CFTax[];
    discount: {
        cartDiscount: CFDiscountDetail;
    };
    fee: {
        cartFee: {
            amount: string;
            label: string;
            percentage: number;
            tax: string;
            taxTableId: string;
        };
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
    price: string;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    totalTax: string;
    total: string;
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
    balance?: string;
    receiptId?: string;
    currency?: string;
}

export interface CFOrder {
    _id: string;
    receiptId?: string;
    companyId: string;
    externalId: string | null;
    status: string;
    customer: Partial<CFActiveCustomer | null>;
    customerNote?: string;
    summary: CFSummary;
    cartDiscount: CFCartDiscountItem | null;
    cartFees: CFCartFeeItem[] | null;
    updatedAt?: string; //server side
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
    refund?: CFRefundItem[];
    balance: string;
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
    currency?: string;
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

export interface CFActiveCart extends CFActiveEntity {
    tax?: number;
    total: number;
    subtotal: number;
    discount?: CFDiscount;
    customFee?: CFCustomFee[];
    products: CFActiveProduct[];
    customSales?: CFActiveCustomSales[];
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
