import { CFActiveCustomer } from "../../CommonTypes";

export interface SetActiveCustomerParams {
    customerId: string;
}

export interface SetActiveCustomerResponse {
    success: boolean;
    customer: CFActiveCustomer;
    timestamp: string;
}

export type SetActiveCustomer = (params?: SetActiveCustomerParams) => Promise<SetActiveCustomerResponse>;
