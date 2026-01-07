// Update Cart Item Quantity Types

export interface UpdateCartItemQuantityParams {
    /** The unique identifier for the specific cart item to update. */
    internalId: string;
    /** The new quantity. If set to 0, the item will be removed from the cart. */
    quantity: number;
}

export interface UpdateCartItemQuantityResponse {
    success: boolean;
    /** The unique identifier of the updated cart item. */
    internalId: string;
    /** The new quantity after the update. */
    quantity: number;
    timestamp: string;
}

export type UpdateCartItemQuantity = (params?: UpdateCartItemQuantityParams) => Promise<UpdateCartItemQuantityResponse>;

