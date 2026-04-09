import { CFActiveProduct } from "../../CommonTypes";

export interface SetActiveProductParams {
    variantId: string;
}

export interface SetActiveProductResponse {
    success: boolean;
    product: CFActiveProduct;
    timestamp: string;
}

export type SetActiveProduct = (params?: SetActiveProductParams) => Promise<SetActiveProductResponse>;