import { CFCustomer } from "../../CommonTypes";

// Add Customer Types
export interface AddCustomerParams {
    customer: Partial<CFCustomer>;
}

export interface AddCustomerResponse {
    success: boolean;
    customer: CFCustomer;
    timestamp: string;
}

export type AddCustomer = (params: AddCustomerParams) => Promise<AddCustomerResponse>;
