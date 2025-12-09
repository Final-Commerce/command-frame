import { GetCustomers, GetCustomersParams, GetCustomersResponse } from "./types";
import { MOCK_CUSTOMERS, safeSerialize } from "../../demo/database";

export const mockGetCustomers: GetCustomers = async (params?: GetCustomersParams): Promise<GetCustomersResponse> => {
    console.log("[Mock] getCustomers called", params);
    
    let customers = MOCK_CUSTOMERS;
    const query = params?.query || {};

    if (query.searchValue) {
        const search = String(query.searchValue).toLowerCase();
        customers = customers.filter(c => 
            c.firstName.toLowerCase().includes(search) || 
            c.lastName.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
    }

    return {
        customers: safeSerialize(customers),
        total: customers.length,
        timestamp: new Date().toISOString()
    };
};

