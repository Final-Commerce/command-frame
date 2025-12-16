import { CFCustomer } from "../../CommonTypes";

// Get Customers Types
export interface GetCustomersParams {
    /** MongoDB-like query object. */
    query?: {
        // MongoDB query fields
        email?: string | { $regex?: string; $options?: string };
        firstName?: string | { $regex?: string; $options?: string };
        lastName?: string | { $regex?: string; $options?: string };
        phone?: string | { $regex?: string; $options?: string };
        tags?: string | { $in?: string[] };
        outletId?: string;
        // Text search (searches across firstName, lastName, email, phone)
        // This is handled by the handler, not directly in query
        [key: string]: any;
    };
    /** Defaults to 0. */
    offset?: number;
    /** Defaults to 100. */
    limit?: number;
}

export interface GetCustomersResponse {
    customers: CFCustomer[];
    total?: number;
    timestamp: string;
}

export type GetCustomers = (params?: GetCustomersParams) => Promise<GetCustomersResponse>;
