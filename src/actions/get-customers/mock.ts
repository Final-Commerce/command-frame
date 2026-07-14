import { GetCustomers, GetCustomersParams, GetCustomersResponse } from "./types";
import { MOCK_CUSTOMERS, safeSerialize } from "../../demo/database";
import { matchesMongoQuery } from "../../demo/mongo-query";

export const mockGetCustomers: GetCustomers = (params?: GetCustomersParams): Promise<GetCustomersResponse> => {
    console.log("[Mock] getCustomers called", params);

    let customers = MOCK_CUSTOMERS;
    const query = params?.query || {};

    // Legacy mock-only convenience key.
    if (query.searchValue) {
        const search = String(query.searchValue).toLowerCase();
        customers = customers.filter(
            c => c.firstName.toLowerCase().includes(search) || c.lastName.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
        );
    }

    // Contract-style Mongo queries — the real host resolves these against
    // MongoDB, so the mock honors the same shape ($or/$and, $regex, $in, equality).
    customers = customers.filter(c => matchesMongoQuery(c, query));

    const total = customers.length;
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 100;
    const paged = customers.slice(offset, offset + limit);

    return Promise.resolve({
        customers: safeSerialize(paged),
        total,
        timestamp: new Date().toISOString()
    });
};
