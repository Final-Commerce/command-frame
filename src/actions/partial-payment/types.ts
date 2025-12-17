import { CFOrder } from "../../CommonTypes";

// Partial Payment Types
export interface PartialPaymentParams {
    /** The payment amount (required if openUI is false). Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
    /** Defaults to false. */
    isPercent?: boolean;
    /** If true, opens the split payment UI. */
    openUI?: boolean;
}

export interface PartialPaymentResponse {
    success: boolean;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount?: number;
    isPercent?: boolean;
    openUI: boolean;
    order: CFOrder | null; // ActiveOrder | null (null for split payments until final payment)
    timestamp: string;
}

export type PartialPayment = (params?: PartialPaymentParams) => Promise<PartialPaymentResponse>;

