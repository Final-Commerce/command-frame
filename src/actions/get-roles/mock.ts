import type { GetRoles, GetRolesResponse } from "./types";

export const mockGetRoles: GetRoles = async (params): Promise<GetRolesResponse> => {
    console.log("[Mock] getRoles called with params:", params);
    return {
        roles: [
            {
                id: "691df9c6c478bada1fb23d0b",
                _id: "691df9c6c478bada1fb23d0b",
                companyId: "691df9c4c478bada1fb23bff",
                name: "Owner",
                permissions: [
                    { category: "hub_access", name: "taxes", value: true, subCategory: "store_management", permissionId: "664759347eefffe8aba84476" },
                    { category: "hub_access", name: "general", value: true, subCategory: "store_management", permissionId: "6647591d7eefffe8aba84475" },
                    { category: "hub_access", name: "reports", value: true, subCategory: "store_management", permissionId: "6645f719ee8498efff5c49bb" },
                    { category: "hub_access", name: "products", value: true, subCategory: "store_management", permissionId: "6645f719f00dc43caaeffe2b" },
                    { category: "hub_access", name: "users", value: true, subCategory: "store_management", permissionId: "6647555b7eefffe8aba84473" },
                    { category: "hub_access", name: "outlets", value: true, subCategory: "store_management", permissionId: "664759047eefffe8aba84474" },
                    { category: "hub_access", name: "builder", value: true, subCategory: "builder_access", permissionId: "664779827eefffe8aba84477" },
                    { category: "hub_access", name: "global_blocks", value: true, subCategory: "builder_access", permissionId: "6645f719f00dc43caaeffe47" },
                    { category: "hub_access", name: "images", value: true, subCategory: "builder_access", permissionId: "6645f719ee8498efff5c49dc" },
                    { category: "hub_access", name: "transactions", value: true, subCategory: "payments_access", permissionId: "6645f719ee8498efff5c4a6b" },
                    { category: "hub_access", name: "payouts", value: true, subCategory: "payments_access", permissionId: "66477add7eefffe8aba84478" },
                    { category: "hub_access", name: "terminals", value: true, subCategory: "payments_access", permissionId: "6645f71998735e68b2c45740" },
                    { category: "hub_access", name: "billing", value: true, subCategory: "payments_access", permissionId: "66bbb00572999149fdd57866" },
                    { category: "station_access", name: "give_discounts", value: true, subCategory: "pos_actions", permissionId: "6723b146ae5f176f7539d8a6" },
                    { category: "station_access", name: "issue_refunds", value: true, subCategory: "pos_actions", permissionId: "6645f719ee8498efff5c4ae4" },
                    { category: "station_access", name: "delete_customers", value: true, subCategory: "pos_actions", permissionId: "6645f71998735e68b2c457df" },
                    { category: "station_access", name: "version_control", value: true, subCategory: "station_setting", permissionId: "66e050160d69015fbff9758a" },
                    { category: "station_access", name: "session_reports", value: true, subCategory: "station_home", permissionId: "6723b271ae5f176f7539d8a7" },
                    { category: "station_access", name: "cash_drawer", value: true, subCategory: "station_home", permissionId: "6723b2aeae5f176f7539d8a8" },
                    { category: "station_access", name: "station_setting", value: true, subCategory: "station_home", permissionId: "6723b2c5ae5f176f7539d8a9" },
                    { category: "station_access", name: "station_transactions", value: true, subCategory: "station_home", permissionId: "677eb109d2607a0169fdf7d5" },
                ]
            },
            {
                id: "691df9c6c478bada1fb23d0c",
                _id: "691df9c6c478bada1fb23d0c",
                companyId: "691df9c4c478bada1fb23bff",
                name: "admin",
                permissions: [
                    { category: "hub_access", name: "taxes", value: true, subCategory: "store_management", permissionId: "664759347eefffe8aba84476" },
                    { category: "hub_access", name: "general", value: true, subCategory: "store_management", permissionId: "6647591d7eefffe8aba84475" },
                    { category: "hub_access", name: "reports", value: true, subCategory: "store_management", permissionId: "6645f719ee8498efff5c49bb" },
                    { category: "hub_access", name: "products", value: true, subCategory: "store_management", permissionId: "6645f719f00dc43caaeffe2b" },
                    { category: "hub_access", name: "users", value: true, subCategory: "store_management", permissionId: "6647555b7eefffe8aba84473" },
                    { category: "hub_access", name: "transactions", value: true, subCategory: "payments_access", permissionId: "6645f719ee8498efff5c4a6b" },
                    { category: "station_access", name: "give_discounts", value: true, subCategory: "pos_actions", permissionId: "6723b146ae5f176f7539d8a6" },
                    { category: "station_access", name: "issue_refunds", value: true, subCategory: "pos_actions", permissionId: "6645f719ee8498efff5c4ae4" },
                    { category: "station_access", name: "delete_customers", value: true, subCategory: "pos_actions", permissionId: "6645f71998735e68b2c457df" },
                ]
            },
            {
                id: "691df9c6c478bada1fb23d0d",
                _id: "691df9c6c478bada1fb23d0d",
                companyId: "691df9c4c478bada1fb23bff",
                name: "cashier",
                permissions: [
                    { category: "station_access", name: "give_discounts", value: false, subCategory: "pos_actions", permissionId: "6723b146ae5f176f7539d8a6" },
                    { category: "station_access", name: "issue_refunds", value: false, subCategory: "pos_actions", permissionId: "6645f719ee8498efff5c4ae4" },
                    { category: "station_access", name: "delete_customers", value: false, subCategory: "pos_actions", permissionId: "6645f71998735e68b2c457df" },
                    { category: "station_access", name: "session_reports", value: true, subCategory: "station_home", permissionId: "6723b271ae5f176f7539d8a7" },
                    { category: "station_access", name: "cash_drawer", value: true, subCategory: "station_home", permissionId: "6723b2aeae5f176f7539d8a8" },
                ]
            }
        ],
        success: true,
        timestamp: new Date().toISOString()
    };
};
