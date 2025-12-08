// Park Order Types
export interface ParkOrderResponse {
    success: boolean;
    order: any; // ActiveOrder
    timestamp: string;
}

export type ParkOrder = () => Promise<ParkOrderResponse>;

