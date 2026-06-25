import { CFOrder } from "../../CommonTypes";

/** Params for extension-initiated payments; host routes by `paymentType`. */
export interface ExtensionPaymentParams {
    paymentType: string;
    processor?: string;
    amount?: number;
    label?: string;
    referenceId?: string;
    extensionId?: string;
    metadata?: Record<string, unknown>;
    /** EMV tag string from an integration terminal; forwarded to the order PaymentMethod's `emv`. */
    emvData?: string;
    /** Processor fee for an integration payment; forwarded to the order PaymentMethod's `processorFee`. */
    processorFee?: number;
}

export interface ExtensionPaymentResponse {
    success: boolean;
    amount: number | null;
    paymentType: string;
    order: CFOrder | null;
    timestamp: string;
}

export type ExtensionPayment = (params?: ExtensionPaymentParams) => Promise<ExtensionPaymentResponse>;
