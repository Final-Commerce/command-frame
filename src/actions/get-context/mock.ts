import { GetContext, GetContextResponse, GetContextResponseManage } from "./types";
import { MOCK_COMPANY, MOCK_OUTLET, MOCK_STATION, MOCK_USER } from "../../demo/database";

// Mock for Render context (POS terminal)
export const mockGetContext: GetContext = async (): Promise<GetContextResponse> => {
    console.log("[Mock] getContext called (Render)");
    
    return {
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
        user: null,
        company: null,
        station: null,
        outlet: null,
        timestamp: new Date().toISOString()
    };
};

// Mock for Manage context (Hub/BuilderHub)
export const mockGetContextManage = async (): Promise<GetContextResponseManage> => {
    console.log("[Mock] getContext called (Manage)");
    
    return {
        user: {
            _id: MOCK_USER.id,
            id: MOCK_USER.id,
            firstName: MOCK_USER.firstName,
            lastName: MOCK_USER.lastName
        },
        company: {
            _id: MOCK_COMPANY.id || "demo_company",
            name: MOCK_COMPANY.name || "Demo Company",
            logo: MOCK_COMPANY.logo
        },
        menuItem: {
            _id: "mock_menu_item_id",
            label: "Demo Menu Item",
            text: "Demo Menu Item",
            iframeUrl: "https://example.com/iframe"
        },
        extensionId: "mock_extension_id",
        outlets: [{
            _id: MOCK_OUTLET._id || MOCK_OUTLET.id,
            id: MOCK_OUTLET.id,
            name: MOCK_OUTLET.name || "Default Outlet",
            address: MOCK_OUTLET.address,
            city: MOCK_OUTLET.city,
            state: MOCK_OUTLET.state,
            country: MOCK_OUTLET.country,
        }],
        timestamp: new Date().toISOString()
    };
};
