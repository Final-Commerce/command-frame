// Terminal Payment Types
export interface TerminalPaymentParams {
    amount?: number;
}

export interface TerminalPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: any | null; // ActiveOrder | null
    timestamp: string;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;

