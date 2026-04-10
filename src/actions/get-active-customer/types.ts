import { CFActiveCustomer } from "../../CommonTypes";

export interface GetActiveCustomerResponse {
    success: boolean;
    customer: CFActiveCustomer | null;
    timestamp: string;
}

export type GetActiveCustomer = () => Promise<GetActiveCustomerResponse>;
