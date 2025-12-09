import { CFOrder } from "../../CommonTypes";

// Cash Payment Types
export interface CashPaymentParams {
    amount?: number;
    openChangeCalculator?: boolean;
}

export interface CashPaymentResponse {
    success: boolean;
    amount: number;
    openChangeCalculator: boolean;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type CashPayment = (params?: CashPaymentParams) => Promise<CashPaymentResponse>;

