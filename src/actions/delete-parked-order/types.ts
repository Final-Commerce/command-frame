// Delete Parked Order Types
export interface DeleteParkedOrderParams {
    orderId: string;
}

export interface DeleteParkedOrderResponse {
    success: boolean;
    orderId: string;
    timestamp: string;
}

export type DeleteParkedOrder = (params?: DeleteParkedOrderParams) => Promise<DeleteParkedOrderResponse>;

