import { ParkOrder, ParkOrderResponse } from "./types";
import { MOCK_PARKED_ORDERS, createOrderFromCart, MOCK_ORDERS } from "../../demo/database";

export const mockParkOrder: ParkOrder = async (): Promise<ParkOrderResponse> => {
    console.log("[Mock] parkOrder called");
    
    // Create a temporary order to capture cart state
    // We use createOrderFromCart which resets the cart and pushes to MOCK_ORDERS
    const tempOrder = createOrderFromCart("none", 0, "none");
    
    // Modify to reflect parked status
    tempOrder.status = "parked";
    tempOrder.paymentMethods = []; // clear dummy payment
    
    // Move from MOCK_ORDERS to MOCK_PARKED_ORDERS
    const foundIndex = MOCK_ORDERS.findIndex(o => o._id === tempOrder._id);
    if (foundIndex !== -1) {
        MOCK_ORDERS.splice(foundIndex, 1);
    }
    
    MOCK_PARKED_ORDERS.push(tempOrder);

    return {
        success: true,
        order: tempOrder,
        timestamp: new Date().toISOString()
    };
};

