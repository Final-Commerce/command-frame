// Update Cart Item Quantity Types

export interface UpdateCartItemQuantityParams {
    /** The cart item to update — a product line's `internalId` or a custom sale's `customSaleId`. */
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
