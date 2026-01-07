import { UpdateCartItemQuantity, UpdateCartItemQuantityParams, UpdateCartItemQuantityResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";
import { CFActiveProduct } from "../../CommonTypes";

export const mockUpdateCartItemQuantity: UpdateCartItemQuantity = async (params?: UpdateCartItemQuantityParams): Promise<UpdateCartItemQuantityResponse> => {
    console.log("[Mock] updateCartItemQuantity called", params);
    
    if (!params?.internalId) {
        throw new Error('internalId is required');
    }

    if (params.quantity === undefined || params.quantity === null) {
        throw new Error('quantity is required');
    }

    const { internalId, quantity } = params;

    // Find the product in the cart
    const productIndex = MOCK_CART.products.findIndex(p => p.internalId === internalId);
    
    if (productIndex === -1) {
        throw new Error(`Cart item with internalId ${internalId} not found`);
    }

    const product = MOCK_CART.products[productIndex] as CFActiveProduct;
    const previousQuantity = product.quantity;

    // If quantity is 0, remove the item
    if (quantity === 0) {
        MOCK_CART.products.splice(productIndex, 1);
        
        // Recalculate totals
        const lineTotal = product.price * previousQuantity;
        MOCK_CART.subtotal -= lineTotal;
        MOCK_CART.total -= lineTotal;
        MOCK_CART.amountToBeCharged = MOCK_CART.total;
        MOCK_CART.remainingBalance = MOCK_CART.total;

        // Publish product-deleted event
        mockPublishEvent('cart', 'product-deleted', {
            product: product,
            internalId: internalId
        });

        return {
            success: true,
            internalId: internalId,
            quantity: 0,
            timestamp: new Date().toISOString()
        };
    }

    // Update quantity
    const quantityDelta = quantity - previousQuantity;
    product.quantity = quantity;
    
    // Recalculate totals
    const lineTotalDelta = product.price * quantityDelta;
    MOCK_CART.subtotal += lineTotalDelta;
    MOCK_CART.total += lineTotalDelta;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish product-updated event
    mockPublishEvent('cart', 'product-updated', {
        product: product,
        previousQuantity: previousQuantity,
        newQuantity: quantity
    });

    return {
        success: true,
        internalId: internalId,
        quantity: quantity,
        timestamp: new Date().toISOString()
    };
};


