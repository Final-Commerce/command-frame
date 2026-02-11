import type { GetUsers, GetUsersResponse } from "./types";
import { CFUserTypes } from "../../CommonTypes";

export const mockGetUsers: GetUsers = async (params): Promise<GetUsersResponse> => {
    console.log("[Mock] getUsers called with params:", params);
    return {
        users: [
            {
                id: "691df9c2047bfc55994d703f",
                _id: "691df9c2047bfc55994d703f",
                firstName: "Sarah",
                lastName: "Mitchell",
                email: "sarah.mitchell@company.com",
                phone: "+1-555-0101",
                type: CFUserTypes.ORG_OWNER,
                role: {
                    id: "691df9c6c478bada1fb23d0b",
                    _id: "691df9c6c478bada1fb23d0b",
                    name: "Owner",
                    companyId: "691df9c4c478bada1fb23bff",
                    permissions: [
                        { category: "hub_access", name: "general", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "products", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "reports", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "users", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "builder", value: true, subCategory: "builder_access" },
                        { category: "hub_access", name: "billing", value: true, subCategory: "payments_access" },
                        { category: "station_access", name: "give_discounts", value: true, subCategory: "pos_actions" },
                        { category: "station_access", name: "issue_refunds", value: true, subCategory: "pos_actions" },
                    ]
                },
                outlets: []
            },
            {
                id: "692a1b3c4d5e6f7890abcde1",
                _id: "692a1b3c4d5e6f7890abcde1",
                firstName: "James",
                lastName: "Rodriguez",
                email: "james.rodriguez@company.com",
                phone: "+1-555-0202",
                type: CFUserTypes.ADMIN,
                role: {
                    id: "691df9c6c478bada1fb23d0c",
                    _id: "691df9c6c478bada1fb23d0c",
                    name: "admin",
                    companyId: "691df9c4c478bada1fb23bff",
                    permissions: [
                        { category: "hub_access", name: "general", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "products", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "reports", value: true, subCategory: "store_management" },
                        { category: "hub_access", name: "users", value: true, subCategory: "store_management" },
                        { category: "station_access", name: "give_discounts", value: true, subCategory: "pos_actions" },
                    ]
                },
                outlets: ["outlet-main", "outlet-downtown"]
            },
            {
                id: "692a1b3c4d5e6f7890abcde2",
                _id: "692a1b3c4d5e6f7890abcde2",
                firstName: "Lisa",
                lastName: "Chen",
                email: "lisa.chen@company.com",
                phone: "+1-555-0303",
                type: CFUserTypes.CASHIER,
                role: {
                    id: "691df9c6c478bada1fb23d0d",
                    _id: "691df9c6c478bada1fb23d0d",
                    name: "cashier",
                    companyId: "691df9c4c478bada1fb23bff",
                    permissions: [
                        { category: "station_access", name: "give_discounts", value: false, subCategory: "pos_actions" },
                        { category: "station_access", name: "issue_refunds", value: false, subCategory: "pos_actions" },
                        { category: "station_access", name: "session_reports", value: true, subCategory: "station_home" },
                    ]
                },
                outlets: ["outlet-main"]
            }
        ],
        success: true,
        timestamp: new Date().toISOString()
    };
};
