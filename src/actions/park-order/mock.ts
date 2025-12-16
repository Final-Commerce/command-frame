import { ParkOrder, ParkOrderResponse } from "./types";
import { MOCK_CART, MOCK_PARKED_ORDERS, resetMockCart, createOrderFromCart } from "../../demo/database";

export const mockParkOrder: ParkOrder = async (): Promise<ParkOrderResponse> => {
    console.log("[Mock] parkOrder called");
    
    // Create an order object but marked as 'parked' or just stored in parked list
    // Re-using createOrderFromCart but effectively we want to store the state
    // For simplicity, let's create a parked order object
    
    // Create a temporary order to capture cart state
    const parkedOrder = createOrderFromCart("none", 0, "none");
    parkedOrder.status = "parked";
    
    // Remove it from the completed orders list (createOrderFromCart pushes to MOCK_ORDERS)
    // In a real app we might have separate endpoints, but here we can just pop it or filter
    // However, createOrderFromCart resets the cart which is what we want.
    // Let's assume createOrderFromCart adds to MOCK_ORDERS, we move it to MOCK_PARKED_ORDERS
    
    // Actually, createOrderFromCart pushes to MOCK_ORDERS. Let's move it.
    // (See database.ts implementation)
    // We need to find the last added order or modify createOrderFromCart...
    // But we can't easily modify createOrderFromCart logic from here without changing database.ts
    // Let's just create it and move it.
    
    // We already called createOrderFromCart which resets mock cart and returns the order.
    // Wait, createOrderFromCart logic:
    // MOCK_ORDERS.push(newOrder);
    // resetMockCart();
    
    // So we just need to move it from MOCK_ORDERS to MOCK_PARKED_ORDERS
    const lastOrderIndex = -1; // We can't easily get index without scanning, but we have the object ref
    
    // Let's implement custom logic to avoid side effects of createOrderFromCart adding to MOCK_ORDERS if we don't want it there yet
    // But createOrderFromCart is convenient.
    
    // Actually, the cleanest way is:
    // 1. Manually construct parked order from MOCK_CART
    // 2. Reset MOCK_CART
    // 3. Add to MOCK_PARKED_ORDERS
    
    // Since we don't have access to all internal helpers of database.ts (unless exported), 
    // we will use createOrderFromCart and then move it.
    
    // Wait, createOrderFromCart is exported. MOCK_ORDERS is exported const array (mutable).
    
    // Note: createOrderFromCart sets status to "completed" by default.
    // We'll change it.
    
    // Problem: createOrderFromCart requires payment info. Parked orders might not have payment.
    
    // Let's do a custom park logic here since we have MOCK_CART access.
    
    const parkedOrderId = `parked_${Date.now()}`;
    const parkedOrderObj: any = { // Using any to bypass strict type check for now if needed, but preferably strict
        ...MOCK_CART,
        _id: parkedOrderId,
        id: parkedOrderId,
        status: "parked",
        createdAt: new Date().toISOString()
    };
    
    // We need to match CFActiveOrder type roughly
    // Since MOCK_CART is CFActiveCart and ParkOrder returns CFActiveOrder/CFOrder
    // We should probably convert Cart to Order structure
    // Re-using createOrderFromCart is safest for structure compliance.
    
    // Hacky but effective:
    const tempOrder = createOrderFromCart("none", 0, "none");
    tempOrder.status = "parked";
    tempOrder.paymentMethods = []; // clear dummy payment
    
    // Move from MOCK_ORDERS to MOCK_PARKED_ORDERS
    // (Assuming MOCK_ORDERS is the array we imported)
    const index = (global as any).mockOrdersIndex || 0; // we don't have access to index easily
    // We can find it by ID
    const foundIndex = (require("../../demo/database").MOCK_ORDERS).findIndex((o: any) => o._id === tempOrder._id);
    if (foundIndex !== -1) {
        (require("../../demo/database").MOCK_ORDERS).splice(foundIndex, 1);
    }
    
    MOCK_PARKED_ORDERS.push(tempOrder);

    return {
        success: true,
        order: tempOrder,
        timestamp: new Date().toISOString()
    };
};

