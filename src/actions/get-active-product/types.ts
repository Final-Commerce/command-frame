import { CFActiveProduct } from "../../CommonTypes";

export interface GetActiveProductResponse {
    success: boolean;
    product: CFActiveProduct | null;
    timestamp: string;
}

export type GetActiveProduct = () => Promise<GetActiveProductResponse>;
