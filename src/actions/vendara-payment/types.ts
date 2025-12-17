import { CFOrder } from "../../CommonTypes";

// Vendara Payment Types
export interface VendaraPaymentParams {
    /** If not provided, uses the cart total. Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
}

export interface VendaraPaymentResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type VendaraPayment = (params?: VendaraPaymentParams) => Promise<VendaraPaymentResponse>;

