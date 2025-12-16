import { ResumeParkedOrder, ResumeParkedOrderParams, ResumeParkedOrderResponse } from "./types";
import { MOCK_PARKED_ORDERS, MOCK_CART, resetMockCart } from "../../demo/database";

export const mockResumeParkedOrder: ResumeParkedOrder = async (params?: ResumeParkedOrderParams): Promise<ResumeParkedOrderResponse> => {
    console.log("[Mock] resumeParkedOrder called", params);
    
    const orderId = params?.orderId;
    let orderToResume = null;
    let index = -1;

    if (orderId) {
        index = MOCK_PARKED_ORDERS.findIndex(o => o._id === orderId);
        if (index !== -1) orderToResume = MOCK_PARKED_ORDERS[index];
    } else {
        // Resume last if no ID
        if (MOCK_PARKED_ORDERS.length > 0) {
            index = MOCK_PARKED_ORDERS.length - 1;
            orderToResume = MOCK_PARKED_ORDERS[index];
        }
    }

    if (!orderToResume) {
        throw new Error("Parked order not found");
    }

    // Restore to MOCK_CART
    // Logic to convert Order back to Cart (simplified)
    resetMockCart();
    
    // Copy properties back
    MOCK_CART.customer = orderToResume.customer as any; // Cast if needed
    // MOCK_CART.products = orderToResume.lineItems... (Mapping needed)
    
    // For Mock demo, we'll do a best effort mapping
    MOCK_CART.products = orderToResume.lineItems.map(li => ({
        id: li.productId,
        name: li.name,
        quantity: li.quantity,
        price: parseFloat(li.price),
        internalId: li.internalId || li.productId,
        variantId: li.variantId,
        sku: li.sku,
        images: [li.image],
        stock: 100,
        taxTableId: "",
        attributes: li.attributes
    } as any));

    MOCK_CART.subtotal = parseFloat(orderToResume.summary.subTotal);
    MOCK_CART.total = parseFloat(orderToResume.summary.total);
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;
    
    // Remove from parked
    MOCK_PARKED_ORDERS.splice(index, 1);

    return {
        success: true,
        order: orderToResume,
        timestamp: new Date().toISOString()
    };
};

