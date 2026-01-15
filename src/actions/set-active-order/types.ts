import { CFOrder } from "../../CommonTypes";

// Set Active Order Types
export interface SetActiveOrderParams {
    orderId: string;
}

export interface SetActiveOrderResponse {
    success: boolean;
    order: CFOrder;
    timestamp: string;
}

export type SetActiveOrder = (params?: SetActiveOrderParams) => Promise<SetActiveOrderResponse>;
