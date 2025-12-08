// Add Customer Types
export interface AddCustomerParams {
    customer: Record<string, any>;
}

export interface AddCustomerResponse {
    success: boolean;
    customer: any;
    timestamp: string;
}

export type AddCustomer = (params: AddCustomerParams) => Promise<AddCustomerResponse>;
