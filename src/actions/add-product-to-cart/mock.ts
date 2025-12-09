import { AddProductToCart, AddProductToCartParams, AddProductToCartResponse } from "./types";
import { MOCK_CART, MOCK_PRODUCTS } from "../../demo/database";
import { CFActiveProduct } from "../../CommonTypes";

export const mockAddProductToCart: AddProductToCart = async (params?: AddProductToCartParams): Promise<AddProductToCartResponse> => {
    console.log("[Mock] addProductToCart called", params);
    
    const productId = params?.productId;
    const variantId = params?.variantId;
    const quantity = params?.quantity || 1;

    let product = MOCK_PRODUCTS[0]; // Default fallback

    if (productId) {
        const found = MOCK_PRODUCTS.find(p => p._id === productId);
        if (found) {
            product = found;
        } else {
            console.warn(`[Mock] Product with ID ${productId} not found, using default.`);
        }
    }

    // Determine variant
    let variant = product.variants[0];
    if (variantId) {
        const foundVariant = product.variants.find(v => v._id === variantId);
        if (foundVariant) {
            variant = foundVariant;
        }
    }

    // Add to MOCK_CART
    const activeProduct: CFActiveProduct = {
        ...product,
        id: product._id,
        internalId: product._id + "_" + Date.now(), // unique ID for cart item
        variantId: variant._id,
        quantity: quantity,
        price: Number(variant.price),
        taxTableId: product.taxTable,
        stock: variant.inventory?.[0]?.stock || 0,
        images: product.images || [],
        localQuantity: quantity,
        sku: variant.sku,
        attributes: variant.attributes.map(a => `${a.name}: ${a.value}`).join(", ")
    } as unknown as CFActiveProduct;

    MOCK_CART.products.push(activeProduct);
    
    // Recalculate totals
    const lineTotal = activeProduct.price * quantity;
    MOCK_CART.subtotal += lineTotal;
    // Simple total calculation (ignoring taxes/fees for mock simplicity unless needed)
    MOCK_CART.total += lineTotal; 
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
