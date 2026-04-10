import { CFActiveRefundDetails } from "../../CommonTypes";

export interface GetActiveRefundResponse {
    success: boolean;
    refund: CFActiveRefundDetails | null;
    timestamp: string;
}

export type GetActiveRefund = () => Promise<GetActiveRefundResponse>;
