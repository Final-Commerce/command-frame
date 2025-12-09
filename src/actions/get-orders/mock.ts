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

    // Filter simulation
    if (params) {
        const { 
            customerId, 
            status, 
            sessionId,
            searchValue,
            limit,
            offset,
            sortBy,
            sortDirection
        } = params;
        
        // 1. Filtering
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

        if (searchValue) {
            const searchLower = String(searchValue).toLowerCase();
            orders = orders.filter(o => {
                const receiptMatch = o.receiptId?.toLowerCase().includes(searchLower);
                const customerNameMatch = o.customer && 'firstName' in o.customer 
                    ? `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(searchLower)
                    : false;
                const customerEmailMatch = o.customer && 'email' in o.customer && o.customer.email
                    ? o.customer.email.toLowerCase().includes(searchLower)
                    : false;
                
                return receiptMatch || customerNameMatch || customerEmailMatch;
            });
        }

        // 2. Sorting
        if (sortBy) {
            orders.sort((a: any, b: any) => {
                let valA = a[sortBy];
                let valB = b[sortBy];

                // Handle nested sort fields if necessary, basic support for now
                if (!valA && sortBy === 'createdAt') valA = a.createdAt || '';
                if (!valB && sortBy === 'createdAt') valB = b.createdAt || '';

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortDirection === 'descending' 
                        ? valB.localeCompare(valA)
                        : valA.localeCompare(valB);
                }
                
                // Number comparison
                return sortDirection === 'descending'
                    ? (valB || 0) - (valA || 0)
                    : (valA || 0) - (valB || 0);
            });
        } else {
            // Default sort by createdAt descending
            orders.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });
        }

        // 3. Pagination
        if (offset !== undefined || limit !== undefined) {
            const start = offset || 0;
            const end = limit ? start + limit : orders.length;
            orders = orders.slice(start, end);
        }
    }
    
    // Simulate Worker Enrichment (populating posData references with actual objects)
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
        total: MOCK_ORDERS.length, // Total before pagination
        timestamp: new Date().toISOString()
    };
};
