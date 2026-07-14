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
    CFActiveRefundDetails,
    CFSmartGridLayout
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

const logo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5OCAxMDQiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik01NS4yOTk4IDUwLjE2NjJMMzcuNzQyMiA0MC4wMjkzTDMxLjcyNzQgNTAuNDQ3MkwzOC45MjQyIDU0LjYwMjJMNTUuMjk5OCA1MC4xNjYyWiIgZmlsbD0iI0E1NjhCQyIvPjxwYXRoIGQ9Ik0zMS45OTYzIDcwLjQ1MDZMNDkuNTU2OCA4MC41ODkxTDU1LjU3MTUgNzAuMTcxM0w0OC4zNzE4IDY2LjAxNDVMMzEuOTk2MyA3MC40NTA2WiIgZmlsbD0iI0E1NjhCQyIvPjxwYXRoIGQ9Ik0zNi4zNTQyIDM0LjI1NzJDMzYuMzU0MiAzNC4yNTcyIDM2LjM1ODMgMzQuMjYzNSAzNi4zNTY3IDM0LjI2NjRDMzcuMTg2OSAzNC4wNjk3IDM4LjA5MTkgMzQuMTU5NiAzOC44ODUxIDM0LjYxNzVMNjIuNjQ4NiA0OC4zMzc0TDU0LjE3MjkgMjkuOTA0OUwzNi4zNDk2IDM0LjI1ODRMMzYuMzU0MiAzNC4yNTcyWiIgZmlsbD0iI0ZDODc1MyIvPjxwYXRoIGQ9Ik0zMy4wOTg4IDE4Ljk1MDdMMzYuMzc3MiAzNC4yNDczTDE4Ljc1MjUgMzkuMzM3M0wyOC45MzcxIDIxLjY5N0MyOS44NDUzIDIwLjEyMzkgMzEuNDE1MiAxOS4xNzYxIDMzLjA5ODggMTguOTUwN1oiIGZpbGw9IiM0MkQzQTkiLz48cGF0aCBkPSJNMTguNzUzMiAzOS4zNDA2TDIwLjY4MjQgNTkuNTE3MUw0LjU3NjA3IDYzLjg5NjJMMTguNzUzMiAzOS4zNDA2WiIgZmlsbD0iIzI3OTdFOCIvPjxwYXRoIGQ9Ik0zNi4zNzc5IDM0LjI0MDNDMzYuMzc3OSAzNC4yNDAzIDM2LjM3NzQgMzQuMjQ3OCAzNi4zODAzIDM0LjI0OTVDMzUuNTYyNCAzNC40OTE5IDM0LjgyMzkgMzUuMDE5NiAzNC4zNjczIDM1LjgxMDVMMjAuNjg2OSA1OS41MDU2TDE4Ljc1NzcgMzkuMzI5MUwzNi4zODI0IDM0LjIzOTFMMzYuMzc3OSAzNC4yNDAzWiIgZmlsbD0iIzFEQkFDQiIvPjxwYXRoIGQ9Ik01NS45MzUyIDEwMS41NDNMNTEuMDgxOSA4Ni42NjU5TDMzLjI1ODcgOTEuMDE5NEw1MC45NDk5IDEwMS4yMzNDNTIuNTI3NiAxMDIuMTQ0IDU0LjM2MzggMTAyLjE4NSA1NS45MzUyIDEwMS41NDNaIiBmaWxsPSIjRkQ1MjYzIi8+PHBhdGggZD0iTTMzLjI1NDkgOTEuMDE0TDI0Ljc4MjEgNzIuNTgzMkw4LjYzMTM1IDc2Ljc5NzVMMzMuMjU0OSA5MS4wMTRaIiBmaWxsPSIjRkZDRjIzIi8+PHBhdGggZD0iTTUxLjA3OSA4Ni42NjM5QzUxLjA3OSA4Ni42NjM5IDUxLjA3NDkgODYuNjU3NiA1MS4wNzY2IDg2LjY1NDdDNTAuMjQ2NCA4Ni44NTE0IDQ5LjM0MTQgODYuNzYxNSA0OC41NDgyIDg2LjMwMzZMMjQuNzg0NiA3Mi41ODM3TDMzLjI2MDQgOTEuMDE2MUw1MS4wODM2IDg2LjY2MjdMNTEuMDc5IDg2LjY2MzlaIiBmaWxsPSIjRkM4NzUzIi8+PHBhdGggZD0iTTU0LjMzNDIgMTAxLjk2OUw1MS4wNTU4IDg2LjY3MjRMNjguNjgwNSA4MS41ODI0TDU4LjQ5NTkgOTkuMjIyN0M1Ny41ODc3IDEwMC43OTYgNTYuMDE3OCAxMDEuNzQ0IDU0LjMzNDIgMTAxLjk2OVoiIGZpbGw9IiM0MkQzQTkiLz48cGF0aCBkPSJNNjguNjgwMSA4MS41ODk5TDY2Ljc0OTMgNjEuNDE2Mkw4Mi44NTU2IDU3LjAzNzJMNjguNjgwMSA4MS41ODk5WiIgZmlsbD0iIzI3OTdFOCIvPjxwYXRoIGQ9Ik01MS4wNTU3IDg2LjY3ODZDNTEuMDU1NyA4Ni42Nzg2IDUxLjA1NjIgODYuNjcxMSA1MS4wNTMyIDg2LjY2OTVDNTEuODcxMSA4Ni40MjcxIDUyLjYwOTcgODUuODk5NCA1My4wNjYzIDg1LjEwODVMNjYuNzQ2NyA2MS40MTMzTDY4LjY3NTkgODEuNTg5OEw1MS4wNTExIDg2LjY3OThMNTEuMDU1NyA4Ni42Nzg2WiIgZmlsbD0iIzFEQkFDQiIvPjxwYXRoIGQ9Ik00Ny44OTQ5IDI2LjI3NjhDNDcuODc4IDI2LjM1OTcgNDcuODUyIDI2LjQ0NTEgNDcuODA2OCAyNi41MjM0TDQ3LjYyNzggMjYuODMzM0M0Ni43ODY1IDI4LjI5MDYgNDQuOTIzMiAyOC43ODY5IDQzLjQ2MTggMjcuOTQzMkM0Mi4wMDA0IDI3LjA5OTQgNDEuNDk4NiAyNS4yMzc2IDQyLjMzOTkgMjMuNzgwNEw0Mi41MTg5IDIzLjQ3MDRDNDIuNTY0MSAyMy4zOTIyIDQyLjYyNSAyMy4zMjY5IDQyLjY4ODQgMjMuMjcwOEwzNi40ODUzIDE5LjY4OTRDMzQuOTA3NiAxOC43Nzg2IDMzLjA3MTQgMTguNzM4MiAzMS41IDE5LjM3OTlMMzYuMzUzMyAzNC4yNTY5TDU0LjE3NjUgMjkuOTAzNUw0Ny44OTQ5IDI2LjI3NjhaIiBmaWxsPSIjRkQ1MjYzIi8+PHBhdGggZD0iTTc1LjYzODYgNDIuMzAyN0M3NS42MjE3IDQyLjM4NTcgNzUuNTk1NiA0Mi40NzExIDc1LjU1MDUgNDIuNTQ5M0w3NS4zNzE1IDQyLjg1OTNDNzQuNTMwMiA0NC4zMTY1IDcyLjY2NjkgNDQuODEyOSA3MS4yMDU0IDQzLjk2OTFDNjkuNzQ0IDQzLjEyNTQgNjkuMjQyMyA0MS4yNjM2IDcwLjA4MzYgMzkuODA2M0w3MC4yNjI2IDM5LjQ5NjNDNzAuMzA3NyAzOS40MTgxIDcwLjM2ODYgMzkuMzUyOSA3MC40MzIgMzkuMjk2N0w1NC4xNzYxIDI5LjkxMTRMNjIuNjUxOSA0OC4zNDM5TDc4LjgwMjYgNDQuMTI5NUw3NS42NDE1IDQyLjMwNDRMNzUuNjM4NiA0Mi4zMDI3WiIgZmlsbD0iI0ZGQ0YyMyIvPjxwYXRoIGQ9Ik03NS42MDU4IDQwLjgyMTlMNzUuNjQ0MiA0MC43NTUyQzc4LjE0ODEgMzYuNDE4MyA3OC42NDY1IDMxLjQ0ODggNzcuNDMwOSAyNi45MzgzQzc2LjIxNTMgMjIuNDI3OCA3My4yODQ3IDE4LjM3MTggNjguOTM1MiAxNS44NjA3QzY0LjU4NTggMTMuMzQ5NSA1OS42MDc5IDEyLjgzOTUgNTUuMDkzOSAxNC4wNDJDNTAuNTc5OSAxNS4yNDQ2IDQ2LjUyNTMgMTguMTYwOSA0NC4wMjE0IDIyLjQ5NzhMNDIuOTkxMSAyNC4yODI0QzQyLjM3MzkgMjUuMzUxNCA0Mi43NDQyIDI2LjcxNjMgNDMuODEzNCAyNy4zMzM2QzQ0Ljg4MjYgMjcuOTUwOSA0Ni4yNTE0IDI3LjU4NjIgNDYuODY2OSAyNi41MjAxTDQ3Ljg5NzMgMjQuNzM1NUM0OS43ODU3IDIxLjQ2NDcgNTIuODQ0MSAxOS4yNjczIDU2LjI1NDggMTguMzU4N0M1OS42NjU0IDE3LjQ1MDEgNjMuNDE5MSAxNy44MzI3IDY2LjY5OTQgMTkuNzI2NkM2OS45Nzk2IDIxLjYyMDQgNzIuMTg3OSAyNC42Nzk5IDczLjEwNjMgMjguMDg3OUM3NC4wMjQ4IDMxLjQ5NiA3My42NTEgMzUuMjQzNCA3MS43NjI2IDM4LjUxNDFMNzEuNzI0MSAzOC41ODA4TDcwLjczMzkgNDAuMjk1OEM3MC4xMTY3IDQxLjM2NDkgNzAuNDg3IDQyLjcyOTcgNzEuNTU2MiA0My4zNDdDNzIuNjI1NCA0My45NjQ0IDczLjk5NDIgNDMuNTk5NyA3NC42MDk4IDQyLjUzMzZMNzUuNTk5OSA0MC44MTg1TDc1LjYwNTggNDAuODIxOVoiIGZpbGw9IiMzRDRDNjYiLz48L3N2Zz4="; // crisp vector mark (was logo.png — pixelated when scaled)
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
        minorUnits: 2,
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
    id: "cat_pastes",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Pastes",
    externalId: "ext_cat_pastes",
    companyId: MOCK_COMPANY.id!,
};

export const MOCK_CATEGORY_SPECIALTY: CFCategory = {
    id: "cat_specialty",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Specialty",
    externalId: "ext_cat_specialty",
    companyId: MOCK_COMPANY.id!,
    parentId: "cat_pastes"
};

export const MOCK_CATEGORY_BASIC: CFCategory = {
    id: "cat_basic",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Basic",
    externalId: "ext_cat_basic",
    companyId: MOCK_COMPANY.id!,
    parentId: "cat_pastes"
};

export const MOCK_CATEGORY_VEGAN: CFCategory = {
    id: "cat_vegan",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Vegan",
    externalId: "ext_cat_vegan",
    companyId: MOCK_COMPANY.id!,
};

export const MOCK_CATEGORY_SPICY: CFCategory = {
    id: "cat_spicy",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    name: "Spicy",
    externalId: "ext_cat_spicy",
    companyId: MOCK_COMPANY.id!,
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
        categories: categories.map(c => ({ name: c.name, externalId: c.externalId ?? c.id })),
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
        categories: categories.map(c => ({ name: c.name, externalId: c.externalId ?? c.id })),
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
            itemDiscounts: [],
            cartDiscount: { percentage: 0, amount: 0 }
        },
        fee: { itemFees: [] },
        totalTax: 0,
        total: variant.price * quantity,
        lineNetWithFees: variant.price * quantity,
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
        subtotalAfterFees: 2100,
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
        subtotalAfterFees: 3000,
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

export const MOCK_ORDER_3: CFActiveOrder = {
    _id: "order_1003",
    currency: CurrencyCode.USD,
    minorUnits: 2,
    receiptId: "1001-0003",
    companyId: MOCK_COMPANY.id!,
    externalId: null,
    status: "refunded",
    paymentState: "refunded",
    fulfillmentState: "fulfilled",
    displayState: "Refunded",
    customer: MOCK_CUSTOMER_3,
    summary: {
        total: 1500,
        subtotalAfterFees: 1500,
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
            transactionId: "trans_card_2",
            paymentType: "credit_card",
            amount: 1500,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            processor: "stripe"
        }
    ],
    source: "pos",
    posData: {
        outlet: MOCK_OUTLET_MAIN.id,
        station: MOCK_STATION_1._id,
        employee: MOCK_USER_MARIO.id
    },
    sessionId: "sess_3",
    metadata: [],
    billing: null,
    shipping: null,
    lineItems: [createLineItem(MOCK_PRODUCT_BEET, 0, 1)],
    customSales: [],
    balance: 0,
    user: MOCK_USER_MARIO,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_1,
    createdAt: new Date(Date.now() - 7200000).toISOString()
};

export const MOCK_PARKED_ORDER_1: CFActiveOrder = {
    _id: "parked_2001",
    currency: CurrencyCode.USD,
    minorUnits: 2,
    receiptId: "PARK-0001",
    companyId: MOCK_COMPANY.id!,
    externalId: null,
    status: "parked",
    paymentState: "unpaid",
    fulfillmentState: "pending",
    displayState: "Parked",
    customer: MOCK_CUSTOMER_4,
    summary: {
        total: 2100,
        subtotalAfterFees: 2100,
        discountTotal: 0,
        shippingTotal: 0,
        totalTaxes: 0,
        taxes: [],
        isTaxInclusive: false
    },
    cartDiscount: null,
    cartFees: [],
    paymentMethods: [],
    source: "pos",
    posData: {
        outlet: MOCK_OUTLET_MAIN.id,
        station: MOCK_STATION_1._id,
        employee: MOCK_USER_LUIGI.id
    },
    sessionId: "sess_park_1",
    metadata: [],
    billing: null,
    shipping: null,
    lineItems: [createLineItem(MOCK_PRODUCT_LEMON, 0, 2)],
    customSales: [],
    balance: 2100,
    user: MOCK_USER_LUIGI,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_1,
    createdAt: new Date(Date.now() - 1800000).toISOString()
};

export const MOCK_PARKED_ORDER_2: CFActiveOrder = {
    _id: "parked_2002",
    currency: CurrencyCode.USD,
    minorUnits: 2,
    receiptId: "PARK-0002",
    companyId: MOCK_COMPANY.id!,
    externalId: null,
    status: "parked",
    paymentState: "unpaid",
    fulfillmentState: "pending",
    displayState: "Parked",
    customer: null,
    summary: {
        total: 2500,
        subtotalAfterFees: 2500,
        discountTotal: 0,
        shippingTotal: 0,
        totalTaxes: 0,
        taxes: [],
        isTaxInclusive: false
    },
    cartDiscount: null,
    cartFees: [],
    paymentMethods: [],
    source: "pos",
    posData: {
        outlet: MOCK_OUTLET_MAIN.id,
        station: MOCK_STATION_2._id,
        employee: MOCK_USER_MARIO.id
    },
    sessionId: "sess_park_2",
    metadata: [],
    billing: null,
    shipping: null,
    lineItems: [createLineItem(MOCK_PRODUCT_CARAMELIZED, 0, 1), createLineItem(MOCK_PRODUCT_GINGER_LIME, 0, 1)],
    customSales: [],
    balance: 2500,
    user: MOCK_USER_MARIO,
    outlet: MOCK_OUTLET_MAIN,
    station: MOCK_STATION_2,
    createdAt: new Date(Date.now() - 900000).toISOString()
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
export const MOCK_ORDERS = [MOCK_ORDER_1, MOCK_ORDER_2, MOCK_ORDER_3];
export const MOCK_PARKED_ORDERS: CFActiveOrder[] = [MOCK_PARKED_ORDER_1, MOCK_PARKED_ORDER_2];

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

// In-memory smart-grid layouts keyed by gridId. Used by mockGetSmartGridLayout /
// mockSaveSmartGridLayout so the standalone builder (no command-frame host) can
// round-trip layouts within a session.
export const MOCK_SMART_GRID_LAYOUTS: Record<string, CFSmartGridLayout> = {};

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
                itemDiscounts: [],
                cartDiscount: { percentage: 0, amount: 0 }
            },
            fee: { itemFees: [] },
            totalTax: 0,
            total: p.price * p.quantity,
            lineNetWithFees: p.price * p.quantity,
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
            subtotalAfterFees: totalNum,
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

/**
 * Apply a (possibly partial) payment of `amount` minor units to the active cart.
 * Decrements the remaining balance; when it reaches zero the sale completes
 * (creates the order, resets the cart, returns it). Otherwise the cart stays
 * open with `amountToBeCharged` reset to what's left, and returns null.
 */
export const applyMockPayment = (
    amount: number,
    paymentType: string,
    processor: string = "cash"
): CFActiveOrder | null => {
    const remainingBefore = MOCK_CART.remainingBalance ?? MOCK_CART.total;
    const charge = Math.min(Math.max(0, amount || remainingBefore), remainingBefore);
    const remainingAfter = Math.max(0, remainingBefore - charge);

    if (remainingAfter > 0) {
        // Partial payment — keep the cart open, queue the rest for the next tender.
        MOCK_CART.remainingBalance = remainingAfter;
        MOCK_CART.amountToBeCharged = remainingAfter;
        mockPublishEvent("cart", "partial-payment-applied", { charged: charge, remaining: remainingAfter });
        return null;
    }

    // Fully paid — create the completed order (this also resets the cart).
    const orderTotal = MOCK_CART.total;
    const order = createOrderFromCart(paymentType, orderTotal, processor);
    mockPublishEvent("payments", "payment-done", { order });
    return order;
};
