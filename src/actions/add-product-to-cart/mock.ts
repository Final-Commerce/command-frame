import { AddProductToCart, AddProductToCartParams, AddProductToCartResponse } from "./types";
import { MOCK_CART, MOCK_PRODUCTS } from "../../demo/database";
import { CFActiveProduct } from "../../CommonTypes";

export const mockAddProductToCart: AddProductToCart = async (params?: AddProductToCartParams): Promise<AddProductToCartResponse> => {
    console.log("[Mock] addProductToCart called", params);
    
    // Simulate finding a product (just pick first one for demo if no params logic implemented)
    // Ideally we would set an active product first via setProductActive then call this.
    // For now, let's assume MOCK_PRODUCTS[0] is being added.
    const product = MOCK_PRODUCTS[0];
    const quantity = params?.quantity || 1;

    // Add to MOCK_CART
    const activeProduct: CFActiveProduct = {
        ...product,
        id: product._id,
        internalId: product._id + "_" + Date.now(),
        variantId: product.variants[0]._id,
        quantity: quantity,
        price: Number(product.price),
        taxTableId: product.taxTable,
        stock: 100,
        images: product.images || [],
        localQuantity: quantity
    } as unknown as CFActiveProduct; // Casting for simplicity in mock

    MOCK_CART.products.push(activeProduct);
    MOCK_CART.total += activeProduct.price * quantity;
    MOCK_CART.subtotal += activeProduct.price * quantity;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    return {
        success: true,
        productId: activeProduct.id,
        variantId: activeProduct.variantId,
        name: activeProduct.name,
        quantity: quantity,
        timestamp: new Date().toISOString()
    };
};

