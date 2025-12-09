import { CFCustomer } from "../../CommonTypes";

// Assign Customer Types
export interface AssignCustomerParams {
    customerId: string;
}

export interface AssignCustomerResponse {
    success: boolean;
    customer: CFCustomer;
    timestamp: string;
}

export type AssignCustomer = (params: AssignCustomerParams) => Promise<AssignCustomerResponse>;
