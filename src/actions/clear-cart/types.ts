// Clear Cart Types
export interface ClearCartResponse {
    success: boolean;
    timestamp: string;
}

export type ClearCart = () => Promise<ClearCartResponse>;

