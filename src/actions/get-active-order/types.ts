import { CFActiveOrder } from "../../CommonTypes";

// Get Active Order Types
export interface GetActiveOrderResponse {
    success: boolean;
    order: CFActiveOrder | null;
    timestamp: string;
}

export type GetActiveOrder = () => Promise<GetActiveOrderResponse>;
