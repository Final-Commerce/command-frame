import { GetContext, GetContextResponse, GetContextResponseManage } from "./types";
import { MOCK_COMPANY, MOCK_OUTLET, MOCK_STATION, MOCK_USER } from "../../demo/database";

// Mock for Render context (POS terminal)
export const mockGetContext: GetContext = (): Promise<GetContextResponse> => {
    console.log("[Mock] getContext called (Render)");

    return Promise.resolve({
        userId: MOCK_USER.id || null,
        companyId: MOCK_COMPANY.id || null,
        companyName: MOCK_COMPANY.name || null,
        deviceId: "mock_device_id",
        stationId: MOCK_STATION._id,
        stationName: MOCK_STATION.name,
        outletId: MOCK_OUTLET.id,
        outletName: MOCK_OUTLET.name || null,
        buildId: "mock_build_id",
        buildName: "Mock Build",
        buildVersion: "1.0.0-mock",
        buildSourceId: "mock_source_id",
        buildIsPremium: true,
        isOffline: false,
        currency: "USD",
        currencySymbol: "$",
        currencyPrefix: "$",
        currencySuffix: "",
        thousandSeparator: ",",
        decimalSeparator: ".",
        user: null,
        company: null,
        station: null,
        outlet: null,
        timestamp: new Date().toISOString()
    });
};

// Mock for Manage context (Hub/BuilderHub)
export const mockGetContextManage = (): Promise<GetContextResponseManage> => {
    console.log("[Mock] getContext called (Manage)");

    return Promise.resolve({
        user: {
            _id: MOCK_USER.id,
            id: MOCK_USER.id,
            firstName: MOCK_USER.firstName,
            lastName: MOCK_USER.lastName
        },
        company: {
            _id: MOCK_COMPANY.id,
            name: MOCK_COMPANY.name || "Demo Company",
            logo: MOCK_COMPANY.logo
        },
        menuItem: {
            _id: "mock_menu_item_id",
            text: "Demo Menu Item",
            iframeUrl: "https://example.com/iframe"
        },
        extensionId: "mock_extension_id",
        outlets: [MOCK_OUTLET as unknown as Record<string, unknown>],
        timestamp: new Date().toISOString()
    });
};
