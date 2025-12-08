// Partial Payment Types
export interface PartialPaymentParams {
    amount?: number;
    isPercent?: boolean;
    openUI?: boolean;
}

export interface PartialPaymentResponse {
    success: boolean;
    amount?: number;
    isPercent?: boolean;
    openUI: boolean;
    order: any | null; // ActiveOrder | null (null for split payments until final payment)
    timestamp: string;
}

export type PartialPayment = (params?: PartialPaymentParams) => Promise<PartialPaymentResponse>;

