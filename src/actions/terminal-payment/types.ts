import { CFOrder } from "../../CommonTypes";

// Terminal Payment Types
export interface TerminalPaymentParams {
    /** If not provided, uses the cart total. Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
}

export interface TerminalPaymentResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;

