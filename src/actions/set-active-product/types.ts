import { CFProduct } from "../../CommonTypes";

export interface SetActiveProductParams {
    productId: string;
}

export interface SetActiveProductResponse {
    success: boolean;
    product: CFProduct;
    timestamp: string;
}

export type SetActiveProduct = (params?: SetActiveProductParams) => Promise<SetActiveProductResponse>;