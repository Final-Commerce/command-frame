import { CFOrder } from "../../CommonTypes";

// Tap to Pay Payment Types
export interface TapToPayPaymentParams {
    /** If not provided, uses the cart total. Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
}

export interface TapToPayPaymentResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type TapToPayPayment = (params?: TapToPayPaymentParams) => Promise<TapToPayPaymentResponse>;

