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
    /** EMV data when the underlying payment carries one (typed as `IntegrationEmvData` by the integration wrapper). */
    emvData?: unknown;
    /** Processor fee in minor units; recorded on the order's paymentMethod.processorFee. */
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
