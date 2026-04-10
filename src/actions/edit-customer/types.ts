import { CFCustomer } from "../../CommonTypes";

// Edit Customer Types
export interface EditCustomerParams {
    customerId: string;
    changes: Partial<Omit<CFCustomer, "_id" | "createdAt" | "updatedAt" | "companyId">>;
}

export interface EditCustomerResponse {
    success: boolean;
    customer: CFCustomer;
    timestamp: string;
}

export type EditCustomer = (params: EditCustomerParams) => Promise<EditCustomerResponse>;
