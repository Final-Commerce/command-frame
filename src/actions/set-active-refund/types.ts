import { CFActiveRefundDetails } from "../../CommonTypes";

export interface SetActiveRefundParams {
    orderId: string;
}

export interface SetActiveRefundResponse {
    success: boolean;
    refund: CFActiveRefundDetails;
    timestamp: string;
}

export type SetActiveRefund = (params?: SetActiveRefundParams) => Promise<SetActiveRefundResponse>;
