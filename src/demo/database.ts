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
    CFCategory,
    CFProductVariant
} from "../CommonTypes";

// Asset Imports
import logo from "./assets/logo.png";
import basilAlmondImg from "./assets/basil-almond-paste.png";
import beerImg from "./assets/beer-paste.png";
import beetImg from "./assets/beet-paste.png";
import caramelizedImg from "./assets/caramelized-paste.png";
import garlicOnionImg from "./assets/garlic-onion-paste.png";
import garlicImg from "./assets/garlic-paste.png";
import gingerLimeImg from "./assets/ginger-lime-paste.png";
import lemonImg from "./assets/lemon-paste.png";
import redPepperImg from "./assets/red-pepper-paste.png";
import roastedTomatoImg from "./assets/roasted-tomato-paste.png";

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

const COMPANY_ID = MOCK_COMPANY.id!;

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
    companies: [COMPANY_ID]
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
    companies: [COMPANY_ID]
};

// --- CUSTOMERS ---
export const MOCK_CUSTOMER_1: CFCustomer = {
    _id: "cust_giuseppe",
    companyId: COMPANY_ID,
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
    companyId: COMPANY_ID,
    email: "sofia@example.com",
    firstName: "Sofia",
    lastName: "Loren",
    phone: "555-0102",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_3: CFCustomer = {
    _id: "cust_alessandro",
    companyId: COMPANY_ID,
    email: "alessandro@example.com",
    firstName: "Alessandro",
    lastName: "Volta",
    phone: "555-0103",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_4: CFCustomer = {
    _id: "cust_isabella",
    companyId: COMPANY_ID,
    email: "isabella@example.com",
    firstName: "Isabella",
    lastName: "Rossellini",
    phone: "555-0104",
    billing: null,
    shipping: null
};

export const MOCK_CUSTOMER_5: CFCustomer = {
    _id: "cust_leonardo",
    companyId: COMPANY_ID,
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
    companyId: COMPANY_ID,
    parentId: null
};

export const MOCK_CATEGORY_SPECIALTY: CFCategory = {
    _id: "cat_specialty",
    name: "Specialty",
    externalId: "ext_cat_specialty",
    companyId: COMPANY_ID,
    parentId: "cat_pastes"
};

export const MOCK_CATEGORY_BASIC: CFCategory = {
    _id: "cat_basic",
    name: "Basic",
    externalId: "ext_cat_basic",
    companyId: COMPANY_ID,
    parentId: "cat_pastes"
};

// --- PRODUCTS ---
const createInventory = (stock: number) => [{ warehouse: "main", outletId: MOCK_OUTLET_MAIN.id, stock }];

// Helper for Simple Product
const createSimpleProduct = (
    id: string,
    name: string,
    price: string,
    image: string,
    category: CFCategory,
    description: string
): CFProduct => {
    const sku = `SKU-${id.toUpperCase()}`;
    return {
        _id: id,
        name,
        companyId: COMPANY_ID,
        externalId: `ext_${id}`,
        sku,
        price,
        minPrice: price,
        maxPrice: price,
        status: "active",
        productType: CFProductType.SIMPLE,
        taxTable: "tax_standard",
        description,
        images: [image],
        categories: { name: category.name, externalId: category.externalId },
        attributes: [],
        variants: [
            {
                _id: `${id}_var_main`,
                sku,
                price,
                salePrice: "0",
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
    basePrice: string,
    largePrice: string,
    image: string,
    category: CFCategory,
    description: string
): CFProduct => {
    const skuBase = `SKU-${id.toUpperCase()}`;
    return {
        _id: id,
        name,
        companyId: COMPANY_ID,
        externalId: `ext_${id}`,
        sku: skuBase,
        price: basePrice,
        minPrice: basePrice,
        maxPrice: largePrice,
        status: "active",
        productType: CFProductType.VARIABLE,
        taxTable: "tax_standard",
        description,
        images: [image],
        categories: { name: category.name, externalId: category.externalId },
        attributes: [{ name: "Size", values: ["Small", "Large"] }],
        variants: [
            {
                _id: `${id}_var_small`,
                sku: `${skuBase}-S`,
                price: basePrice,
                salePrice: "0",
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
                salePrice: "0",
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
    "12.00",
    basilAlmondImg,
    MOCK_CATEGORY_SPECIALTY,
    "A rich blend of fresh basil and roasted almonds."
);

export const MOCK_PRODUCT_BEER = createVariableProduct(
    "prod_beer",
    "Beer Paste",
    "15.00",
    "25.00",
    beerImg,
    MOCK_CATEGORY_SPECIALTY,
    "Unique paste infused with dark lager."
);

export const MOCK_PRODUCT_BEET = createSimpleProduct(
    "prod_beet",
    "Beet Paste",
    "10.00",
    beetImg,
    MOCK_CATEGORY_BASIC,
    "Earthy and sweet beet paste, perfect for salads."
);

export const MOCK_PRODUCT_CARAMELIZED = createVariableProduct(
    "prod_caramelized",
    "Caramelized Paste",
    "14.00",
    "22.00",
    caramelizedImg,
    MOCK_CATEGORY_SPECIALTY,
    "Slow-cooked caramelized onion paste."
);

export const MOCK_PRODUCT_GARLIC_ONION = createVariableProduct(
    "prod_garlic_onion",
    "Garlic Onion Paste",
    "11.00",
    "18.00",
    garlicOnionImg,
    MOCK_CATEGORY_BASIC,
    "Classic savory base for any dish."
);

export const MOCK_PRODUCT_GARLIC = createSimpleProduct(
    "prod_garlic",
    "Garlic Paste",
    "9.00",
    garlicImg,
    MOCK_CATEGORY_BASIC,
    "Pure, intense garlic paste."
);

export const MOCK_PRODUCT_GINGER_LIME = createVariableProduct(
    "prod_ginger_lime",
    "Ginger Lime Paste",
    "13.00",
    "20.00",
    gingerLimeImg,
    MOCK_CATEGORY_SPECIALTY,
    "Zesty and spicy, great for asian cuisine."
);

export const MOCK_PRODUCT_LEMON = createSimpleProduct(
    "prod_lemon",
    "Lemon Paste",
    "10.50",
    lemonImg,
    MOCK_CATEGORY_BASIC,
    "Bright citrus flavor concentrate."
);

export const MOCK_PRODUCT_RED_PEPPER = createVariableProduct(
    "prod_red_pepper",
    "Red Pepper Paste",
    "12.50",
    "19.00",
    redPepperImg,
    MOCK_CATEGORY_BASIC,
    "Roasted red peppers with a hint of spice."
);

export const MOCK_PRODUCT_ROASTED_TOMATO = createVariableProduct(
    "prod_roasted_tomato",
    "Roasted Tomato Paste",
    "11.50",
    "18.50",
    roastedTomatoImg,
    MOCK_CATEGORY_BASIC,
    "Deep, umami-rich tomato flavor."
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
            itemDiscount: { percentage: 0, amount: "0" },
            cartDiscount: { percentage: 0, amount: "0" }
        },
        fee: { itemFee: { percentage: 0, amount: "0", tax: "0", taxTableId: "" } },
        totalTax: "0",
        total: (parseFloat(variant.price) * quantity).toFixed(2),
        metadata: [],
        image: product.images?.[0] || "",
        sku: variant.sku,
        stock: variant.inventory?.[0]?.stock || 0,
        attributes: variant.attributes.map(a => `${a.name}: ${a.value}`).join(", ")
    };
};

export const MOCK_ORDER_1: CFActiveOrder = {
    _id: "order_1001",
    receiptId: "1001-0001",
    companyId: COMPANY_ID,
    externalId: null,
    status: "completed",
    customer: MOCK_CUSTOMER_1,
    summary: {
        total: "21.00",
        subTotal: "21.00",
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
            transactionId: "trans_cash_1",
            paymentType: "cash",
            amount: "21.00",
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
    billing: MOCK_CUSTOMER_1.billing,
    shipping: null,
    lineItems: [
        createLineItem(MOCK_PRODUCT_GARLIC, 0, 1), // 9.00
        createLineItem(MOCK_PRODUCT_BASIL_ALMOND, 0, 1) // 12.00
    ],
    customSales: [],
    balance: "0",
    user: MOCK_USER_LUIGI,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_1,
    createdAt: new Date().toISOString()
};

export const MOCK_ORDER_2: CFActiveOrder = {
    _id: "order_1002",
    receiptId: "1001-0002",
    companyId: COMPANY_ID,
    externalId: null,
    status: "completed",
    customer: MOCK_CUSTOMER_2,
    summary: {
        total: "30.00",
        subTotal: "30.00",
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
            transactionId: "trans_card_1",
            paymentType: "credit_card",
            amount: "30.00",
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
    lineItems: [
        createLineItem(MOCK_PRODUCT_BEER, 0, 2) // 15.00 * 2 = 30.00
    ],
    customSales: [],
    balance: "0",
    user: MOCK_USER_MARIO,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_2,
    createdAt: new Date(Date.now() - 3600000).toISOString()
};

// --- EXPORT COLLECTIONS ---

export const MOCK_USERS = [MOCK_USER_MARIO, MOCK_USER_LUIGI];
export const MOCK_STATIONS = [MOCK_STATION_1, MOCK_STATION_2];
export const MOCK_OUTLETS = [MOCK_OUTLET_MAIN];
export const MOCK_CUSTOMERS = [
    MOCK_CUSTOMER_1,
    MOCK_CUSTOMER_2,
    MOCK_CUSTOMER_3,
    MOCK_CUSTOMER_4,
    MOCK_CUSTOMER_5
];
export const MOCK_CATEGORIES = [MOCK_CATEGORY_PASTES, MOCK_CATEGORY_SPECIALTY, MOCK_CATEGORY_BASIC];
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
    MOCK_PRODUCT_ROASTED_TOMATO
];
export const MOCK_ORDERS = [MOCK_ORDER_1, MOCK_ORDER_2];

// Compatibility Exports
export const MOCK_USER = MOCK_USERS[0];
export const MOCK_STATION = MOCK_STATIONS[0];
export const MOCK_OUTLET = MOCK_OUTLETS[0];

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

// Helper to simulate safe JSON serialization
export const safeSerialize = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
};

// Helper to create order from cart
export const createOrderFromCart = (
    paymentType: string,
    amount: number | string,
    processor: string = "cash"
): CFActiveOrder => {
    // Generate new Order ID
    const orderId = `order_${Date.now()}`;
    const receiptId = `receipt_${Date.now()}`;

    // Map cart products to line items
    const lineItems = MOCK_CART.products.map(p => {
        // Find original product to get attributes/variants if needed
        // For simplicity, we use what's in cart
        return {
            productId: p.id,
            variantId: p.variantId,
            name: p.name,
            quantity: p.quantity,
            price: String(p.price),
            taxes: [],
            discount: {
                itemDiscount: { percentage: 0, amount: "0" },
                cartDiscount: { percentage: 0, amount: "0" }
            },
            fee: { itemFee: { percentage: 0, amount: "0", tax: "0", taxTableId: "" } },
            totalTax: "0",
            total: (p.price * p.quantity).toFixed(2),
            metadata: [],
            image: p.images?.[0] || "",
            sku: p.sku || "",
            stock: 100, // Mock stock
            attributes: p.attributes || ""
        };
    });

    const totalStr = String(MOCK_CART.total.toFixed(2));
    
    const newOrder: CFActiveOrder = {
        _id: orderId,
        receiptId,
        companyId: COMPANY_ID,
        externalId: null,
        status: "completed",
        customer: MOCK_CART.customer ? (MOCK_CART.customer as CFCustomer) : null,
        summary: {
            total: totalStr,
            subTotal: totalStr,
            discountTotal: "0",
            shippingTotal: "0",
            totalTaxes: "0",
            taxes: [],
            isTaxInclusive: false
        },
        cartDiscount: MOCK_CART.discount ? { label: MOCK_CART.discount.label || "Discount", amount: "0", percentage: MOCK_CART.discount.value } : null,
        cartFees: [],
        paymentMethods: [
            {
                transactionId: `trans_${Date.now()}`,
                paymentType,
                amount: String(amount),
                timestamp: new Date().toISOString(),
                processor
            }
        ],
        source: "pos",
        posData: {
            outlet: MOCK_OUTLET_MAIN.id,
            station: MOCK_STATION_1._id,
            employee: MOCK_USER_LUIGI.id
        },
        sessionId: `session_${Date.now()}`,
        metadata: [],
        billing: MOCK_CART.customer?.billing || null,
        shipping: MOCK_CART.customer?.shipping || null,
        lineItems,
        customSales: [],
        balance: "0",
        user: MOCK_USER_LUIGI,
        outlet: MOCK_OUTLET_MAIN,
        station: MOCK_STATION_1,
        createdAt: new Date().toISOString()
    };

    MOCK_ORDERS.push(newOrder);
    resetMockCart();
    
    return newOrder;
};
