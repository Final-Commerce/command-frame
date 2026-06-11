import type { GetUsers, GetUsersResponse } from "./types";
import { CFUserTypes } from "../../CommonTypes";

export const mockGetUsers: GetUsers = async (params): Promise<GetUsersResponse> => {
    console.log("[Mock] getUsers called with params:", params);
    return {
        users: [
            {
                id: "691df9c2047bfc55994d703f",
                firstName: "Sarah",
                lastName: "Mitchell",
                email: "sarah.mitchell@company.com",
                phone: "+1-555-0101",
                type: CFUserTypes.ORG_OWNER,
                role: {
                    id: "691df9c6c478bada1fb23d0b",
                    name: "Owner",
                    permissions: [
                        { category: "hub_access", label: "general", name: "general", value: true },
                        { category: "hub_access", label: "products", name: "products", value: true },
                        { category: "hub_access", label: "reports", name: "reports", value: true },
                        { category: "hub_access", label: "users", name: "users", value: true },
                        { category: "hub_access", label: "builder", name: "builder", value: true },
                        { category: "hub_access", label: "billing", name: "billing", value: true },
                        { category: "station_access", label: "give_discounts", name: "give_discounts", value: true },
                        { category: "station_access", label: "issue_refunds", name: "issue_refunds", value: true },
                    ]
                },
                outlets: []
            },
            {
                id: "692a1b3c4d5e6f7890abcde1",
                firstName: "James",
                lastName: "Rodriguez",
                email: "james.rodriguez@company.com",
                phone: "+1-555-0202",
                type: CFUserTypes.ADMIN,
                role: {
                    id: "691df9c6c478bada1fb23d0c",
                    name: "admin",
                    permissions: [
                        { category: "hub_access", label: "general", name: "general", value: true },
                        { category: "hub_access", label: "products", name: "products", value: true },
                        { category: "hub_access", label: "reports", name: "reports", value: true },
                        { category: "hub_access", label: "users", name: "users", value: true },
                        { category: "station_access", label: "give_discounts", name: "give_discounts", value: true },
                    ]
                },
                outlets: ["outlet-main", "outlet-downtown"]
            },
            {
                id: "692a1b3c4d5e6f7890abcde2",
                firstName: "Lisa",
                lastName: "Chen",
                email: "lisa.chen@company.com",
                phone: "+1-555-0303",
                type: CFUserTypes.CASHIER,
                role: {
                    id: "691df9c6c478bada1fb23d0d",
                    name: "cashier",
                    permissions: [
                        { category: "station_access", label: "give_discounts", name: "give_discounts", value: false },
                        { category: "station_access", label: "issue_refunds", name: "issue_refunds", value: false },
                        { category: "station_access", label: "session_reports", name: "session_reports", value: true },
                    ]
                },
                outlets: ["outlet-main"]
            }
        ],
        success: true,
        timestamp: new Date().toISOString()
    };
};
