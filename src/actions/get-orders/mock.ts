import { GetOrders, GetOrdersParams, GetOrdersResponse } from "./types";
import {
    MOCK_ORDERS,
    MOCK_USERS,
    MOCK_STATIONS,
    MOCK_OUTLETS,
    safeSerialize
} from "../../demo/database";

export const mockGetOrders: GetOrders = async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
    console.log("[Mock] getOrders called", params);
    
    // Start with a safe copy of mock orders
    let orders = safeSerialize(MOCK_ORDERS);

    // Basic filtering simulation
    if (params) {
        const { customerId, status, sessionId } = params;
        
        if (customerId) {
            orders = orders.filter(o => 
                o.customer && 
                '_id' in o.customer && 
                o.customer._id === customerId
            );
        }

        if (status) {
            orders = orders.filter(o => o.status === status);
        }

        if (sessionId) {
            orders = orders.filter(o => o.sessionId === sessionId);
        }
    }
    
    const enrichedOrders = orders.map((order: any) => {
        const enrichedOrder = { ...order };
        
        if (enrichedOrder.posData) {
            // Enrich Employee
            if (typeof enrichedOrder.posData.employee === 'string') {
                const employee = MOCK_USERS.find(u => u.id === enrichedOrder.posData.employee);
                if (employee) {
                    enrichedOrder.posData.employee = employee;
                }
            }

            // Enrich Station
            if (typeof enrichedOrder.posData.station === 'string') {
                const station = MOCK_STATIONS.find(s => s._id === enrichedOrder.posData.station);
                if (station) {
                    enrichedOrder.posData.station = station;
                }
            }

            // Enrich Outlet
            if (typeof enrichedOrder.posData.outlet === 'string') {
                const outlet = MOCK_OUTLETS.find(o => o.id === enrichedOrder.posData.outlet);
                if (outlet) {
                    enrichedOrder.posData.outlet = outlet;
                }
            }
        }

        return enrichedOrder;
    });

    return {
        success: true,
        orders: enrichedOrders,
        total: enrichedOrders.length,
        timestamp: new Date().toISOString()
    };
};
