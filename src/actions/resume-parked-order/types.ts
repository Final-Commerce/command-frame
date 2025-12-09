import { CFOrder } from "../../CommonTypes";

// Resume Parked Order Types
export interface ResumeParkedOrderParams {
    orderId: string;
}

export interface ResumeParkedOrderResponse {
    success: boolean;
    order: CFOrder; // ActiveOrder
    timestamp: string;
}

export type ResumeParkedOrder = (params?: ResumeParkedOrderParams) => Promise<ResumeParkedOrderResponse>;

