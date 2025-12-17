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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    value: number;
    label?: string;
    isPercent?: boolean;
}

export interface CFCustomFee {
    label: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    taxTableName: string;
    taxTableId: string;
}

export interface CFInventory {
    warehouse: string;
    outletId: string;
    stock?: number | null;
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
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    price: string;
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    salePrice: string;
    isOnSale: boolean;
    barcode?: string;
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    costPrice?: string;
    manageStock: boolean;
    externalId: string;
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
    externalId: string;
    taxTable: string;
    name: string;
    description?: string;
    shortDescription?: string;
    images?: string[];
    categories: {
        name: string;
        externalId: string;
    };
    attributes: {
        name: string;
        values: string[];
    }[];
    tags?: string[];
    supplier?: string;
    sku?: string;
    productType: CFProductType;
    variants: CFProductVariant[];

    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    minPrice?: string;
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    percentage: number;
}

export interface CFSummary {
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    discountTotal: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    shippingTotal?: string | null;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    total: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    totalTaxes: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    subTotal: string;
    taxes: CFTax[];
    tip?: CFTip | null;
    isTaxInclusive: boolean;
}

export interface CFCartDiscountItem {
    label: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    percentage: number;
}

export interface CFCartFeeItem {
    id: string;
    label: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    percentage: number;
    taxTableId?: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    tax?: string;
    taxName: string;
}

export interface CFTipPayment {
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    tipTo: string;
    percentage: number;
}

export interface CFRefundedTipPayment {
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    percentage: number;
    transactionId: string;
    tipTo: string;
}

export interface CFPaymentMethod {
    transactionId: string;
    paymentType: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    timestamp: string;
    processor: string;
    saleId?: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    change?: string | null;
    tip?: CFTipPayment | null;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    const?: string;
}

export interface CFFeeDetail {
    percentage: number;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    price: string;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    fee: CFFeeLineItem;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    totalTax: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    price: string;
    quantity: number;
    applyTaxes: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    total: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    totalTax: string;
    taxes: CFTax[];
    discount: {
        cartDiscount: CFDiscountDetail;
    };
    fee: {
        cartFee: {
            /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
            amount: string;
            label: string;
            percentage: number;
            /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Price in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    price: string;
    taxes: CFTax[];
    discount: CFDiscountLineItem;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    totalTax: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    balance: string;
    signature?: string | null;
}

export interface CFActiveUserRole {
    id?: string;
    name: string;
    permissions: {
        category: string;
        label: string;
        name: string;
        value: boolean;
    }[];
}

export interface CFActiveUser extends CFActiveEntity {
    firstName?: string;
    lastName?: string;
    role: CFActiveUserRole;
    id: string;
    outlets?: string[];
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
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    price: number;
    discount?: any;
    fee?: any;
}

export interface CFActiveCart extends CFActiveEntity {
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    tax?: number;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    total: number;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    subtotal: number;
    discount?: CFDiscount;
    customFee?: CFCustomFee[];
    products: CFActiveProduct[];
    customSales?: CFActiveCustomSales[];
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    remainingBalance?: number;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amountToBeCharged: number;
    customer?: Partial<CFCustomer | null> | null;
    orderNotes?: string;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    cartTotal?: number;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    orderTotal?: number;
    orderId?: string;
}

export interface CFActiveCompany extends CFActiveEntity {
    id?: string;
    name?: string;
    logo?: string;
    settings?: any;
}

export interface CFContext {
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
