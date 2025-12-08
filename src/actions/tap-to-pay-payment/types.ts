// Tap to Pay Payment Types
export interface TapToPayPaymentParams {
    amount?: number;
}

export interface TapToPayPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: any | null; // ActiveOrder | null
    timestamp: string;
}

export type TapToPayPayment = (params?: TapToPayPaymentParams) => Promise<TapToPayPaymentResponse>;

