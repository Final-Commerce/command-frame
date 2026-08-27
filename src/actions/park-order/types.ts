import { CFOrder } from "../../CommonTypes";

// Park Order Types
export interface ParkOrderResponse {
    success: boolean;
    order: CFOrder; // ActiveOrder
    timestamp: string;
}

export type ParkOrder = () => Promise<ParkOrderResponse>;

