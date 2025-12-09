import { CFOrder } from "../../CommonTypes";

// Terminal Payment Types
export interface TerminalPaymentParams {
    amount?: number;
}

export interface TerminalPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;

