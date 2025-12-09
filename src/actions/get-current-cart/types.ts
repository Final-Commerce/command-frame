import { CFActiveCart } from "../../CommonTypes";

// Get Current Cart Types
export interface GetCurrentCartResponse {
    success: boolean;
    cart: CFActiveCart; // ActiveCart
    timestamp: string;
}

export type GetCurrentCart = () => Promise<GetCurrentCartResponse>;

