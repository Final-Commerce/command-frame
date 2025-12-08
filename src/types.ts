// Example Function Types
export interface ExampleFunctionParams {
    param1?: string;
    param2?: string;
    param3?: string;
}

export interface ExampleFunctionResponse {
    receivedParams: ExampleFunctionParams;
    responsePayload: {
        field1: string;
        field2: string;
        field3: string;
    };
    timestamp: string;
    processed: boolean;
}

export type ExampleFunction = (params?: ExampleFunctionParams) => Promise<ExampleFunctionResponse>;

// Get Products Types
export interface GetProductsParams {
    query?: Record<string, any>;
}

export interface GetProductsResponse {
    products: any[];
    timestamp: string;
}

export type GetProducts = (params?: GetProductsParams) => Promise<GetProductsResponse>;

// Add Custom Sale Types
export interface AddCustomSaleParams {
    label: string;
    price: number | string;
    applyTaxes?: boolean;
}

export interface AddCustomSaleResponse {
    success: boolean;
    label: string;
    price: number;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCustomSale = (params?: AddCustomSaleParams) => Promise<AddCustomSaleResponse>;

// Get Customers Types
export interface GetCustomersParams {
    query?: Record<string, any>;
}

export interface GetCustomersResponse {
    customers: any[];
    total?: number;
    timestamp: string;
}

export type GetCustomers = (params?: GetCustomersParams) => Promise<GetCustomersResponse>;

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
