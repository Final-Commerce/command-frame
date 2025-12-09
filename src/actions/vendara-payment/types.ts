import { CFOrder } from "../../CommonTypes";

// Vendara Payment Types
export interface VendaraPaymentParams {
    amount?: number;
}

export interface VendaraPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type VendaraPayment = (params?: VendaraPaymentParams) => Promise<VendaraPaymentResponse>;

