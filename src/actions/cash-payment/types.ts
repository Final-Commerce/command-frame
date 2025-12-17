import { CFOrder } from "../../CommonTypes";

// Cash Payment Types
export interface CashPaymentParams {
    /** If not provided, uses the cart total. Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
    /** Defaults to false. */
    openChangeCalculator?: boolean;
}

export interface CashPaymentResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number;
    openChangeCalculator: boolean;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type CashPayment = (params?: CashPaymentParams) => Promise<CashPaymentResponse>;

