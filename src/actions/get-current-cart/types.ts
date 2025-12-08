// Get Current Cart Types
export interface GetCurrentCartResponse {
    success: boolean;
    cart: any; // ActiveCart
    timestamp: string;
}

export type GetCurrentCart = () => Promise<GetCurrentCartResponse>;

