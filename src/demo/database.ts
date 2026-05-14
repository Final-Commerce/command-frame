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
    CFCategory,
    CurrencyCode,
    CFActiveProduct,
    CFSession,
    CFActiveRefundDetails
} from "../CommonTypes";

export * from "./mocks";

/** Replace mock catalog / context data in place (same array references mock handlers use). */
export interface MockDatabaseConfig {
    company?: Partial<CFActiveCompany>;
    outlets?: CFActiveOutlet[];
    stations?: CFActiveStation[];
    users?: CFActiveUser[];
    customers?: CFCustomer[];
    categories?: CFCategory[];
    products?: CFProduct[];
    orders?: CFActiveOrder[];
    parkedOrders?: CFActiveOrder[];
}

// Asset Imports - Using Remote URLs to avoid build complexity with asset copying
const ASSETS_BASE_URL = "https://raw.githubusercontent.com/Final-Commerce/command-frame/refs/heads/main/src/demo/assets";

const logo = `${ASSETS_BASE_URL}/logo.png`;
const basilAlmondImg = `${ASSETS_BASE_URL}/basil-almond-paste.png`;
const beerImg = `${ASSETS_BASE_URL}/beer-paste.png`;
const beetImg = `${ASSETS_BASE_URL}/beet-paste.png`;
const caramelizedImg = `${ASSETS_BASE_URL}/caramelized-paste.png`;
const garlicOnionImg = `${ASSETS_BASE_URL}/garlic-onion-paste.png`;
const garlicImg = `${ASSETS_BASE_URL}/garlic-paste.png`;
const gingerLimeImg = `${ASSETS_BASE_URL}/ginger-lime-paste.png`;
const lemonImg = `${ASSETS_BASE_URL}/lemon-paste.png`;
const redPepperImg = `${ASSETS_BASE_URL}/red-pepper-paste.png`;
const roastedTomatoImg = `${ASSETS_BASE_URL}/roasted-tomato-paste.png`;

// --- COMPANY ---
export const MOCK_COMPANY: CFActiveCompany = {
    id: "comp_paste_demo",
    name: "Paste Demo Company",
    logo: logo,
    settings: {
        currencyPrefix: "$",
        currencySuffix: "",
        currencySymbol: "$",
        decimalSeparator: ".",
        thousandSeparator: ",",
        decimals: { $numberInt: "2" }
    }
};

// --- OUTLETS ---
export const MOCK_OUTLET_MAIN: CFActiveOutlet = {
    id: "outlet_main",
    _id: "outlet_main",
    name: "Main Kitchen",
    address: "123 Pasta Lane",
    address2: "Suite 1",
    city: "Rome",
    state: "RM",
    country: "IT",
    taxId: "TAX-IT-001",
    postCode: "00100",
    sequenceNumber: 1,
    stripeAccountId: "acct_paste_main"
};

// --- STATIONS ---
export const MOCK_STATION_1: CFActiveStation = {
    _id: "station_counter_1",
    name: "Counter 1",
    status: "open",
    sequenceNumber: 1,
    stripeTerminalId: "tm_1"
};

export const MOCK_STATION_2: CFActiveStation = {
    _id: "station_counter_2",
    name: "Counter 2",
    status: "open",
    sequenceNumber: 2,
    stripeTerminalId: "tm_2"
};

// --- SESSION (cash register) ---
export const MOCK_SESSION: CFSession = {
    id: "sess_mock_1",
    stationId: MOCK_STATION_1._id,
    openingAmount: 100,
    openedBy: "user_mario",
    currency: CurrencyCode.USD,
    minorUnits: 2
};

// --- ACTIVE REFUND DETAILS (refund UI state) ---
export const MOCK_ACTIVE_REFUND_DETAILS: CFActiveRefundDetails = {
    quantities: { line_mock_1: 1 },
    options: {},
    refundAmounts: {},
    currentRefundTotal: 0,
    amountRemaining: null,
    isRefund: true
};

// --- USERS ---
export const MOCK_USER_MARIO: CFActiveUser = {
    id: "user_mario",
    firstName: "Mario",
    lastName: "Demoji",
    type: CFUserTypes.MANAGER,
    role: {
        id: "role_manager",
        name: "Manager",
        permissions: []
    },
    outlets: [MOCK_OUTLET_MAIN.id],
    companies: [MOCK_COMPANY.id!]
};

export const MOCK_USER_LUIGI: CFActiveUser = {
    id: "user_luigi",
    firstName: "Luigi",
    lastName: "Demoji",
    type: CFUserTypes.CASHIER,
    role: {
        id: "role_cashier",
        name: "Cashier",
        permissions: []
    },
    outlets: [MOCK_OUTLET_MAIN.id],
    companies: [MOCK_COMPANY.id!]
};

// --- CUSTOMERS ---
export const MOCK_CUSTOMER_1: CFCustomer = {
    _id: "cust_giuseppe",
    companyId: MOCK_COMPANY.id!,
    email: "giuseppe@example.com",
    firstName: "Giuseppe",
    lastName: "Verdi",
    phone: "555-0101",
    billing: {
        firstName: "Giuseppe",
        lastName: "Verdi",
        address1: "Via Roma 1",
        address2: "",
        city: "Milano",
        postCode: "20100",
        country: "IT"
    },
    shipping: null
};

export const MOCK_CUSTOMER_2: CFCustomer = {
    _id: "cust_sofia",
    companyId: MOCK_COMPANY.id!,
    email: "sofia@example.com",
    firstName: "Sofia",
    lastName: "Loren",
    phone: "555-0102",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_3: CFCustomer = {
    _id: "cust_alessandro",
    companyId: MOCK_COMPANY.id!,
    email: "alessandro@example.com",
    firstName: "Alessandro",
    lastName: "Volta",
    phone: "555-0103",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_4: CFCustomer = {
    _id: "cust_isabella",
    companyId: MOCK_COMPANY.id!,
    email: "isabella@example.com",
    firstName: "Isabella",
    lastName: "Rossellini",
    phone: "555-0104",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_5: CFCustomer = {
    _id: "cust_leonardo",
    companyId: MOCK_COMPANY.id!,
    email: "leonardo@example.com",
    firstName: "Leonardo",
    lastName: "Da Vinci",
    phone: "555-0105",
    billing: null,
    shipping: null
};

// --- CATEGORIES ---
export const MOCK_CATEGORY_PASTES: CFCategory = {
    _id: "cat_pastes",
    name: "Pastes",
    externalId: "ext_cat_pastes",
    companyId: MOCK_COMPANY.id!,
    parentId: null
};

export const MOCK_CATEGORY_SPECIALTY: CFCategory = {
    _id: "cat_specialty",
    name: "Specialty",
    externalId: "ext_cat_specialty",
    companyId: MOCK_COMPANY.id!,
    parentId: "cat_pastes"
};

export const MOCK_CATEGORY_BASIC: CFCategory = {
    _id: "cat_basic",
    name: "Basic",
    externalId: "ext_cat_basic",
    companyId: MOCK_COMPANY.id!,
    parentId: "cat_pastes"
};

export const MOCK_CATEGORY_VEGAN: CFCategory = {
    _id: "cat_vegan",
    name: "Vegan",
    externalId: "ext_cat_vegan",
    companyId: MOCK_COMPANY.id!,
    parentId: null
};

export const MOCK_CATEGORY_SPICY: CFCategory = {
    _id: "cat_spicy",
    name: "Spicy",
    externalId: "ext_cat_spicy",
    companyId: MOCK_COMPANY.id!,
    parentId: null
};

// --- PRODUCTS ---
const createInventory = (stock: number) => [{ warehouse: "main", outletId: MOCK_OUTLET_MAIN.id, stock }];

// Helper for Simple Product
const createSimpleProduct = (id: string, name: string, price: number, image: string, categories: CFCategory[], description: string): CFProduct => {
    const sku = `SKU-${id.toUpperCase()}`;
    return {
        _id: id,
        name,
        companyId: MOCK_COMPANY.id!,
        externalId: `ext_${id}`,
        sku,
        currency: CurrencyCode.USD,
        minorUnits: 2,
        minPrice: price,
        maxPrice: price,
        status: "active",
        productType: CFProductType.SIMPLE,
        taxTable: "tax_standard",
        description,
        images: [image],
        categories: categories.map(c => c._id),
        attributes: [],
        variants: [
            {
                _id: `${id}_var_main`,
                sku,
                price,
                salePrice: 0,
                isOnSale: false,
                manageStock: true,
                externalId: `ext_${id}_var`,
                attributes: [],
                inventory: createInventory(100)
            }
        ]
    };
};

// Helper for Variable Product (Size: Small, Large)
const createVariableProduct = (
    id: string,
    name: string,
    basePrice: number,
    largePrice: number,
    image: string,
    categories: CFCategory[],
    description: string
): CFProduct => {
    const skuBase = `SKU-${id.toUpperCase()}`;
    return {
        _id: id,
        name,
        companyId: MOCK_COMPANY.id!,
        externalId: `ext_${id}`,
        sku: skuBase,
        currency: CurrencyCode.USD,
        minorUnits: 2,
        minPrice: basePrice,
        maxPrice: largePrice,
        status: "active",
        productType: CFProductType.VARIABLE,
        taxTable: "tax_standard",
        description,
        images: [image],
        categories: categories.map(c => c._id),
        attributes: [{ name: "Size", values: ["Small", "Large"] }],
        variants: [
            {
                _id: `${id}_var_small`,
                sku: `${skuBase}-S`,
                price: basePrice,
                salePrice: 0,
                isOnSale: false,
                manageStock: true,
                externalId: `ext_${id}_var_s`,
                attributes: [{ name: "Size", value: "Small" }],
                inventory: createInventory(50)
            },
            {
                _id: `${id}_var_large`,
                sku: `${skuBase}-L`,
                price: largePrice,
                salePrice: 0,
                isOnSale: false,
                manageStock: true,
                externalId: `ext_${id}_var_l`,
                attributes: [{ name: "Size", value: "Large" }],
                inventory: createInventory(30)
            }
        ]
    };
};

export const MOCK_PRODUCT_BASIL_ALMOND = createSimpleProduct(
    "prod_basil_almond",
    "Basil Almond Paste",
    1200,
    basilAlmondImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_VEGAN],
    "A rich blend of fresh basil and roasted almonds."
);

export const MOCK_PRODUCT_BEER = createVariableProduct(
    "prod_beer",
    "Beer Paste",
    1500,
    2500,
    beerImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY],
    "Unique paste infused with dark lager."
);

export const MOCK_PRODUCT_BEET = createSimpleProduct(
    "prod_beet",
    "Beet Paste",
    1000,
    beetImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN],
    "Earthy and sweet beet paste, perfect for salads."
);

export const MOCK_PRODUCT_CARAMELIZED = createVariableProduct(
    "prod_caramelized",
    "Caramelized Paste",
    1400,
    2200,
    caramelizedImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_VEGAN],
    "Slow-cooked caramelized onion paste."
);

export const MOCK_PRODUCT_GARLIC_ONION = createVariableProduct(
    "prod_garlic_onion",
    "Garlic Onion Paste",
    1100,
    1800,
    garlicOnionImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN],
    "Classic savory base for any dish."
);

export const MOCK_PRODUCT_GARLIC = createSimpleProduct(
    "prod_garlic",
    "Garlic Paste",
    900,
    garlicImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN],
    "Pure, intense garlic paste."
);

export const MOCK_PRODUCT_GINGER_LIME = createVariableProduct(
    "prod_ginger_lime",
    "Ginger Lime Paste",
    1300,
    2000,
    gingerLimeImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_SPICY, MOCK_CATEGORY_VEGAN],
    "Zesty and spicy, great for asian cuisine."
);

export const MOCK_PRODUCT_LEMON = createSimpleProduct(
    "prod_lemon",
    "Lemon Paste",
    1050,
    lemonImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN],
    "Bright citrus flavor concentrate."
);

export const MOCK_PRODUCT_RED_PEPPER = createVariableProduct(
    "prod_red_pepper",
    "Red Pepper Paste",
    1250,
    1900,
    redPepperImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_SPICY, MOCK_CATEGORY_VEGAN],
    "Roasted red peppers with a hint of spice."
);

export const MOCK_PRODUCT_ROASTED_TOMATO = createVariableProduct(
    "prod_roasted_tomato",
    "Roasted Tomato Paste",
    1150,
    1850,
    roastedTomatoImg,
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN],
    "Deep, umami-rich tomato flavor."
);

export const MOCK_PRODUCT_MINT_LEMON = createSimpleProduct(
    "prod_mint_lemon",
    "Mint Lemon Paste",
    1200,
    lemonImg, // Reusing lemon image for now
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_VEGAN],
    "Refreshing mint and lemon blend."
);

export const MOCK_PRODUCT_CHILI_GARLIC = createVariableProduct(
    "prod_chili_garlic",
    "Chili Garlic Paste",
    1050,
    1650,
    redPepperImg, // Reusing red pepper image
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_SPICY, MOCK_CATEGORY_VEGAN],
    "Spicy garlic paste with chili flakes."
);

export const MOCK_PRODUCT_HABANERO = createSimpleProduct(
    "prod_habanero",
    "Habanero Paste",
    1400,
    redPepperImg, // Reusing red pepper image
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPICY, MOCK_CATEGORY_VEGAN],
    "Extremely spicy habanero concentrate."
);

export const MOCK_PRODUCT_BLACK_GARLIC = createSimpleProduct(
    "prod_black_garlic",
    "Black Garlic Paste",
    1800,
    garlicImg, // Reusing garlic image
    [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_VEGAN],
    "Fermented black garlic paste, sweet and savory."
);

// --- ORDERS ---
// Helper to create line item
const createLineItem = (product: CFProduct, variantIndex: number = 0, quantity: number = 1) => {
    const variant = product.variants[variantIndex];
    return {
        productId: product._id,
        variantId: variant._id,
        name: product.name,
        quantity,
        price: variant.price,
        taxes: [],
        discount: {
            itemDiscount: { percentage: 0, amount: 0 },
            cartDiscount: { percentage: 0, amount: 0 }
        },
        fee: { itemFee: { percentage: 0, amount: 0, tax: 0, taxTableId: "" } },
        totalTax: 0,
        total: variant.price * quantity,
        metadata: [],
        image: product.images?.[0] || "",
        sku: variant.sku,
        stock: variant.inventory?.[0]?.stock || 0,
        attributes: variant.attributes.map(a => `${a.name}: ${a.value}`).join(", ")
    };
};

export const MOCK_ORDER_1: CFActiveOrder = {
    _id: "order_1001",
    currency: CurrencyCode.USD,
    minorUnits: 2,
    receiptId: "1001-0001",
    companyId: MOCK_COMPANY.id!,
    externalId: null,
    status: "completed",
    paymentState: "paid",
    fulfillmentState: "fulfilled",
    displayState: "Completed",
    customer: MOCK_CUSTOMER_1,
    summary: {
        total: 2100,
        subTotal: 2100,
        discountTotal: 0,
        shippingTotal: 0,
        totalTaxes: 0,
        taxes: [],
        isTaxInclusive: false
    },
    cartDiscount: null,
    cartFees: [],
    paymentMethods: [
        {
            transactionId: "trans_cash_1",
            paymentType: "cash",
            amount: 2100,
            timestamp: new Date().toISOString(),
            processor: "cash"
        }
    ],
    source: "pos",
    posData: {
        outlet: MOCK_OUTLET_MAIN.id,
        station: MOCK_STATION_1._id,
        employee: MOCK_USER_LUIGI.id
    },
    sessionId: "sess_1",
    metadata: [],
    billing: MOCK_CUSTOMER_1.billing || null,
    shipping: null,
    lineItems: [createLineItem(MOCK_PRODUCT_GARLIC, 0, 1), createLineItem(MOCK_PRODUCT_BASIL_ALMOND, 0, 1)],
    customSales: [],
    balance: 0,
    user: MOCK_USER_LUIGI,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_1,
    createdAt: new Date().toISOString()
};

export const MOCK_ORDER_2: CFActiveOrder = {
    _id: "order_1002",
    currency: CurrencyCode.USD,
    minorUnits: 2,
    receiptId: "1001-0002",
    companyId: MOCK_COMPANY.id!,
    externalId: null,
    status: "completed",
    paymentState: "paid",
    fulfillmentState: "fulfilled",
    displayState: "Completed",
    customer: MOCK_CUSTOMER_2,
    summary: {
        total: 3000,
        subTotal: 3000,
        discountTotal: 0,
        shippingTotal: 0,
        totalTaxes: 0,
        taxes: [],
        isTaxInclusive: false
    },
    cartDiscount: null,
    cartFees: [],
    paymentMethods: [
        {
            transactionId: "trans_card_1",
            paymentType: "credit_card",
            amount: 3000,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            processor: "stripe"
        }
    ],
    source: "pos",
    posData: {
        outlet: MOCK_OUTLET_MAIN.id,
        station: MOCK_STATION_2._id,
        employee: MOCK_USER_MARIO.id
    },
    sessionId: "sess_2",
    metadata: [],
    billing: null,
    shipping: null,
    lineItems: [createLineItem(MOCK_PRODUCT_BEER, 0, 2)],
    customSales: [],
    balance: 0,
    user: MOCK_USER_MARIO,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_2,
    createdAt: new Date(Date.now() - 3600000).toISOString()
};

// --- EXPORT COLLECTIONS ---

export const MOCK_USERS = [MOCK_USER_MARIO, MOCK_USER_LUIGI];
export const MOCK_STATIONS = [MOCK_STATION_1, MOCK_STATION_2];
export const MOCK_OUTLETS = [MOCK_OUTLET_MAIN];
export const MOCK_CUSTOMERS = [MOCK_CUSTOMER_1, MOCK_CUSTOMER_2, MOCK_CUSTOMER_3, MOCK_CUSTOMER_4, MOCK_CUSTOMER_5];
export const MOCK_CATEGORIES = [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_BASIC, MOCK_CATEGORY_VEGAN, MOCK_CATEGORY_SPICY];
export const MOCK_PRODUCTS = [
    MOCK_PRODUCT_BASIL_ALMOND,
    MOCK_PRODUCT_BEER,
    MOCK_PRODUCT_BEET,
    MOCK_PRODUCT_CARAMELIZED,
    MOCK_PRODUCT_GARLIC_ONION,
    MOCK_PRODUCT_GARLIC,
    MOCK_PRODUCT_GINGER_LIME,
    MOCK_PRODUCT_LEMON,
    MOCK_PRODUCT_RED_PEPPER,
    MOCK_PRODUCT_ROASTED_TOMATO,
    MOCK_PRODUCT_MINT_LEMON,
    MOCK_PRODUCT_CHILI_GARLIC,
    MOCK_PRODUCT_HABANERO,
    MOCK_PRODUCT_BLACK_GARLIC
];
export const MOCK_ORDERS = [MOCK_ORDER_1, MOCK_ORDER_2];
export const MOCK_PARKED_ORDERS: CFActiveOrder[] = [];

// Compatibility Exports (reassigned by setMockDatabase)
export let MOCK_USER: CFActiveUser = MOCK_USERS[0];
export let MOCK_STATION: CFActiveStation = MOCK_STATIONS[0];
export let MOCK_OUTLET: CFActiveOutlet = MOCK_OUTLETS[0];

export let MOCK_CART: CFActiveCart = {
    total: 0,
    subtotal: 0,
    amountToBeCharged: 0,
    remainingBalance: 0,
    products: [],
    customSales: [],
    nonRevenueItems: [],
    customer: null
};

export let MOCK_ACTIVE_PRODUCT: CFActiveProduct;

export const setMockActiveProduct = (activeProduct: CFActiveProduct) => {
    MOCK_ACTIVE_PRODUCT = activeProduct;
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
        nonRevenueItems: [],
        customer: null
    };
};

function resolveMockOrderCurrency(): CurrencyCode {
    const settings = MOCK_COMPANY.settings as { currency?: string } | undefined;
    const raw = settings?.currency;
    if (typeof raw === "string" && (Object.values(CurrencyCode) as string[]).includes(raw)) {
        return raw as CurrencyCode;
    }
    return CurrencyCode.USD;
}

/**
 * Replace in-memory mock data used by default mock handlers. Arrays are mutated in place
 * so existing imports from this module keep working.
 */
export function setMockDatabase(config: Partial<MockDatabaseConfig>): void {
    if (config.company !== undefined) {
        Object.assign(MOCK_COMPANY, config.company);
    }
    if (config.outlets !== undefined) {
        MOCK_OUTLETS.splice(0, MOCK_OUTLETS.length, ...config.outlets);
    }
    if (config.stations !== undefined) {
        MOCK_STATIONS.splice(0, MOCK_STATIONS.length, ...config.stations);
    }
    if (config.users !== undefined) {
        MOCK_USERS.splice(0, MOCK_USERS.length, ...config.users);
    }
    if (config.customers !== undefined) {
        MOCK_CUSTOMERS.splice(0, MOCK_CUSTOMERS.length, ...config.customers);
    }
    if (config.categories !== undefined) {
        MOCK_CATEGORIES.splice(0, MOCK_CATEGORIES.length, ...config.categories);
    }
    if (config.products !== undefined) {
        MOCK_PRODUCTS.splice(0, MOCK_PRODUCTS.length, ...config.products);
    }
    if (config.orders !== undefined) {
        MOCK_ORDERS.splice(0, MOCK_ORDERS.length, ...config.orders);
    }
    if (config.parkedOrders !== undefined) {
        MOCK_PARKED_ORDERS.splice(0, MOCK_PARKED_ORDERS.length, ...config.parkedOrders);
    }

    if (MOCK_OUTLETS.length > 0) {
        Object.assign(MOCK_OUTLET_MAIN, MOCK_OUTLETS[0]);
        if (MOCK_OUTLET_MAIN.id === undefined && MOCK_OUTLET_MAIN._id !== undefined) {
            MOCK_OUTLET_MAIN.id = MOCK_OUTLET_MAIN._id;
        }
    }
    if (MOCK_USERS.length > 0) {
        MOCK_USER = MOCK_USERS[0]!;
    }
    if (MOCK_STATIONS.length > 0) {
        MOCK_STATION = MOCK_STATIONS[0]!;
    }
    if (MOCK_OUTLETS.length > 0) {
        MOCK_OUTLET = MOCK_OUTLETS[0]!;
    }
    resetMockCart();
}

// Helper to simulate safe JSON serialization
export const safeSerialize = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data)) as T;
};

// Mock Event Emitter for pub/sub simulation in mock mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockEventCallback = (event: any) => void;
const mockTopicSubscribers: Record<string, MockEventCallback[]> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockPublishEvent = (topic: string, eventType: string, data: any) => {
    const subscribers = mockTopicSubscribers[topic] || [];
    const event = {
        topic,
        type: eventType,
        data,
        timestamp: new Date().toISOString()
    };

    subscribers.forEach(callback => {
        try {
            callback(event);
        } catch (error) {
            console.error(`[Mock] Error in topic callback for ${topic}:`, error);
        }
    });
};

export const mockSubscribeToTopic = (topic: string, callback: MockEventCallback) => {
    if (!mockTopicSubscribers[topic]) {
        mockTopicSubscribers[topic] = [];
    }
    mockTopicSubscribers[topic].push(callback);
};

// Helper to create order from cart
export const createOrderFromCart = (paymentType: string, amount: number, processor: string = "cash"): CFActiveOrder => {
    const primaryOutlet = MOCK_OUTLETS[0] ?? MOCK_OUTLET_MAIN;
    const primaryStation = MOCK_STATIONS[0] ?? MOCK_STATION;
    const employeeUser = MOCK_USERS.find(u => u.type === CFUserTypes.CASHIER) ?? MOCK_USERS[0] ?? MOCK_USER;
    const orderCurrency = resolveMockOrderCurrency();

    // Generate new Order ID
    const orderId = `order_${Date.now()}`;
    const receiptId = `receipt_${Date.now()}`;

    // Map cart products to line items
    const lineItems = MOCK_CART.products.map(p => {
        return {
            productId: p.id,
            variantId: p.variantId,
            name: p.name,
            quantity: p.quantity,
            price: p.price,
            taxes: [],
            discount: {
                itemDiscount: { percentage: 0, amount: 0, const: "0" },
                cartDiscount: { percentage: 0, amount: 0, const: "0" }
            },
            fee: { itemFee: { percentage: 0, amount: 0, tax: 0, taxTableId: "" } },
            totalTax: 0,
            total: p.price * p.quantity,
            metadata: [],
            image: p.images?.[0] || "",
            sku: p.sku || "",
            stock: 100,
            attributes: p.attributes || ""
        };
    });

    const totalNum = MOCK_CART.total;

    const newOrder: CFActiveOrder = {
        _id: orderId,
        currency: orderCurrency,
        minorUnits: 2,
        receiptId,
        companyId: MOCK_COMPANY.id!,
        externalId: null,
        status: "completed",
        paymentState: "paid",
        fulfillmentState: "fulfilled",
        displayState: "Completed",
        customer: MOCK_CART.customer ? (MOCK_CART.customer as CFCustomer) : null,
        summary: {
            total: totalNum,
            subTotal: totalNum,
            discountTotal: 0,
            shippingTotal: 0,
            totalTaxes: 0,
            taxes: [],
            isTaxInclusive: false
        },
        cartDiscount: MOCK_CART.discount ? { label: MOCK_CART.discount.label || "Discount", amount: 0, percentage: MOCK_CART.discount.value } : null,
        cartFees: [],
        paymentMethods: [
            {
                transactionId: `trans_${Date.now()}`,
                paymentType,
                amount,
                timestamp: new Date().toISOString(),
                processor
            }
        ],
        source: "pos",
        posData: {
            outlet: primaryOutlet.id,
            station: primaryStation._id,
            employee: employeeUser.id
        },
        sessionId: `session_${Date.now()}`,
        metadata: [],
        billing: MOCK_CART.customer?.billing || null,
        shipping: MOCK_CART.customer?.shipping || null,
        lineItems,
        customSales: [],
        balance: 0,
        user: employeeUser,
        outlet: primaryOutlet,
        station: primaryStation,
        createdAt: new Date().toISOString()
    };

    MOCK_ORDERS.push(newOrder);
    resetMockCart();

    // Publish cart-created event after cart is reset (simulates new empty cart)
    mockPublishEvent("cart", "cart-created", {});

    return newOrder;
};
