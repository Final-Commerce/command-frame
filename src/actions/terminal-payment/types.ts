import { CFOrder } from "../../CommonTypes";

// Terminal Payment Types
export interface TerminalPaymentParams {
    /** If not provided, uses the cart total. */
    amount?: number;
    /** "Bluetooth" or "Cloud". Defaults to "Cloud". */
    paymentType?: 'Bluetooth' | 'Cloud';
}

export interface TerminalPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null; // ActiveOrder | null
    timestamp: string;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;

