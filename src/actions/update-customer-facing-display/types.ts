// Update Customer Facing Display Types
export interface UpdateCustomerFacingDisplayParams {
    pageId: string;
}

export interface UpdateCustomerFacingDisplayResponse {
    success: boolean;
    pageId: string;
    timestamp: string;
}

export type UpdateCustomerFacingDisplay = (params?: UpdateCustomerFacingDisplayParams) => Promise<UpdateCustomerFacingDisplayResponse>;

