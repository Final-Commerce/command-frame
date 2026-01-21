import { GetContext, GetContextResponse, GetContextResponseManage } from "./types";
import { MOCK_COMPANY, MOCK_OUTLET, MOCK_STATION, MOCK_USER } from "../../demo/database";

// Mock for Render context (POS terminal)
export const mockGetContext: GetContext = async (): Promise<GetContextResponse> => {
    console.log("[Mock] getContext called (Render)");
    
    return {
        userId: MOCK_USER.id,
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
            email: "demo@example.com",
            firstName: MOCK_USER.firstName,
            lastName: MOCK_USER.lastName,
            outlets: [MOCK_OUTLET.id],
            type: "organization_owner",
            role: { name: "Admin", permissions: [] }
        },
        company: {
            _id: MOCK_COMPANY.id || "mock_company_id",
            name: MOCK_COMPANY.name || "Demo Company",
            logo: MOCK_COMPANY.logo,
            organizationId: "mock_org_id",
            settings: {
                currency: "USD",
                currencySymbol: "$",
                defaultLanguage: "en",
                timeZone: "America/New_York"
            }
        },
        menuItem: {
            _id: "mock_menu_item_id",
            text: "Demo Menu Item",
            iframeUrl: "https://example.com/iframe"
        },
        timestamp: new Date().toISOString()
    };
};
