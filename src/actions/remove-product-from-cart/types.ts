// Remove Product From Cart Types

export interface RemoveProductFromCartParams {
    /** The unique identifier for the specific cart item to remove. */
    internalId: string;
}

export interface RemoveProductFromCartResponse {
    success: boolean;
    /** The unique identifier of the removed cart item. */
    internalId: string;
    timestamp: string;
}

export type RemoveProductFromCart = (params?: RemoveProductFromCartParams) => Promise<RemoveProductFromCartResponse>;

