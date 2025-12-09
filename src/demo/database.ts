/**
 * Mock Database for Standalone/Demo Mode
 * Stores mock data that mimics the Render environment
 */

import {
    CFActiveCompany,
    CFActiveUser,
    CFActiveStation,
    CFActiveOutlet,
    CFActiveOrder,
    CFCustomer,
    CFProduct,
    CFProductType,
    CFUserTypes,
    CFActiveCart,
    CFActiveProduct,
    CFCategory
} from "../CommonTypes";

export const MOCK_COMPANY: CFActiveCompany = {
    id: "mock_company_id",
    name: "Mock Company",
    logo: "https://via.placeholder.com/150",
    settings: {
        currencyPrefix: "$",
        currencySuffix: "",
        currencySymbol: "$",
        decimalSeparator: ".",
        thousandSeparator: ",",
        decimals: { $numberInt: "2" }
    }
};

export const MOCK_USER: CFActiveUser = {
    id: "mock_user_id",
    firstName: "Demo",
    lastName: "User",
    type: CFUserTypes.CASHIER,
    role: {
        id: "mock_role_id",
        name: "Manager",
        permissions: []
    },
    outlets: ["mock_outlet_id"],
    companies: []
};

export const MOCK_STATION: CFActiveStation = {
    _id: "mock_station_id",
    name: "Demo Station",
    status: "open",
    sequenceNumber: 1
};

export const MOCK_OUTLET: CFActiveOutlet = {
    id: "mock_outlet_id",
    _id: "mock_outlet_id",
    name: "Demo Outlet",
    address: "123 Mock St",
    address2: "",
    city: "Mock City",
    state: "MO",
    country: "US",
    taxId: "TAX-123",
    postCode: "12345",
    sequenceNumber: 1,
    stripeAccountId: "acct_mock123"
};

export const MOCK_CUSTOMERS: CFCustomer[] = [
    {
        _id: "cust_1",
        companyId: "mock_company_id",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "555-0101",
        billing: null,
        shipping: null
    },
    {
        _id: "cust_2",
        companyId: "mock_company_id",
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        phone: "555-0102",
        billing: null,
        shipping: null
    }
];

export const MOCK_PRODUCTS: CFProduct[] = [
    {
        _id: "prod_1",
        name: "Mock Product A",
        companyId: "mock_company_id",
        externalId: "ext_prod_1",
        sku: "SKU-A",
        price: "10.00",
        minPrice: "10.00",
        maxPrice: "10.00",
        status: "active",
        productType: CFProductType.SIMPLE,
        taxTable: "tax_1",
        description: "A simple mock product",
        images: [],
        categories: { name: "General", externalId: "cat_1" },
        attributes: [{ name: "Size", values: ["M"] }],
        variants: [
            {
                _id: "var_1",
                sku: "SKU-A",
                price: "10.00",
                salePrice: "0",
                isOnSale: false,
                manageStock: true,
                externalId: "ext_var_1",
                attributes: [{ name: "Size", value: "M" }],
                inventory: [{ warehouse: "main", outletId: "mock_outlet_id", stock: 100 }]
            }
        ]
    },
    {
        _id: "prod_2",
        name: "Mock Variable Product B",
        companyId: "mock_company_id",
        externalId: "ext_prod_2",
        sku: "SKU-B",
        price: "20.00",
        minPrice: "20.00",
        maxPrice: "25.00",
        status: "active",
        productType: CFProductType.VARIABLE,
        taxTable: "tax_1",
        images: [],
        categories: { name: "General", externalId: "cat_1" },
        attributes: [{ name: "Color", values: ["Red", "Blue"] }],
        variants: [
            {
                _id: "var_2_red",
                sku: "SKU-B-RED",
                price: "20.00",
                salePrice: "0",
                isOnSale: false,
                manageStock: true,
                externalId: "ext_var_2_red",
                attributes: [{ name: "Color", value: "Red" }],
                inventory: [{ warehouse: "main", outletId: "mock_outlet_id", stock: 50 }]
            },
            {
                _id: "var_2_blue",
                sku: "SKU-B-BLUE",
                price: "25.00",
                salePrice: "0",
                isOnSale: false,
                manageStock: true,
                externalId: "ext_var_2_blue",
                attributes: [{ name: "Color", value: "Blue" }],
                inventory: [{ warehouse: "main", outletId: "mock_outlet_id", stock: 30 }]
            }
        ]
    }
];

export const MOCK_CATEGORIES: CFCategory[] = [
    {
        _id: "cat_1",
        name: "General",
        externalId: "ext_cat_1",
        companyId: "mock_company_id",
        parentId: null
    },
    {
        _id: "cat_2",
        name: "Clothing",
        externalId: "ext_cat_2",
        companyId: "mock_company_id",
        parentId: null
    },
    {
        _id: "cat_3",
        name: "Shirts",
        externalId: "ext_cat_3",
        companyId: "mock_company_id",
        parentId: "cat_2"
    }
];

export const MOCK_ORDERS: CFActiveOrder[] = [
    {
        _id: "order_1",
        receiptId: "001001000001",
        companyId: "mock_company_id",
        externalId: null,
        status: "completed",
        customer: MOCK_CUSTOMERS[0],
        summary: {
            total: "10.00",
            subTotal: "10.00",
            discountTotal: "0",
            shippingTotal: "0",
            totalTaxes: "0",
            taxes: [],
            isTaxInclusive: false
        },
        cartDiscount: null,
        cartFees: [],
        paymentMethods: [
            {
                transactionId: "trans_1",
                paymentType: "cash",
                amount: "10.00",
                timestamp: new Date().toISOString(),
                processor: "cash"
            }
        ],
        source: "pos",
        posData: {
            outlet: "mock_outlet_id",
            station: "mock_station_id",
            employee: "mock_user_id"
        },
        sessionId: "session_1",
        metadata: [],
        billing: null,
        shipping: null,
        lineItems: [], // Populate if needed
        customSales: [],
        balance: "0",
        user: MOCK_USER,
        outlet: MOCK_OUTLET,
        station: MOCK_STATION
    }
];

export let MOCK_CART: CFActiveCart = {
    total: 0,
    subtotal: 0,
    amountToBeCharged: 0,
    remainingBalance: 0,
    products: [],
    customSales: [],
    customer: null
};

// Helper to reset cart
export const resetMockCart = () => {
    MOCK_CART = {
        total: 0,
        subtotal: 0,
        amountToBeCharged: 0,
        remainingBalance: 0,
        products: [],
        customSales: [],
        customer: null
    };
};

// Helper to simulate safe JSON serialization (breaking circular refs if any, though our mock data is mostly tree-like)
export const safeSerialize = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
};

