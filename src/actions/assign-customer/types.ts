// Assign Customer Types
export interface AssignCustomerParams {
    customerId: string;
}

export interface AssignCustomerResponse {
    success: boolean;
    customer: any;
    timestamp: string;
}

export type AssignCustomer = (params: AssignCustomerParams) => Promise<AssignCustomerResponse>;
