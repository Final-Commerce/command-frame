import { GetCustomExtensions, GetCustomExtensionsResponse } from "./types";

export const mockGetCustomExtensions: GetCustomExtensions = async (): Promise<GetCustomExtensionsResponse> => {
    console.log("[Mock] getCustomExtensions called");
    
    const mockExtensions = [
        {
            _id: "ext_loyalty_program",
            label: "Loyalty Program Extension",
            description: "Add a loyalty points system to your POS",
            category: "Customer Management",
            short_description: "Loyalty points tracking",
            long_description: "A comprehensive loyalty program that allows you to track customer points, offer rewards, and increase customer retention.",
            main_image: "https://example.com/images/loyalty-extension.png",
            backgroundUrl: "https://example.com/images/loyalty-bg.jpg",
            gallery: [
                "https://example.com/images/loyalty-1.png",
                "https://example.com/images/loyalty-2.png"
            ],
            price: "$29.99",
            website: "https://loyalty-extension.example.com",
            isDeleted: false,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-10T14:30:00.000Z",
            __v: 0
        },
        {
            _id: "ext_inventory_analytics",
            label: "Inventory Analytics",
            description: "Advanced inventory tracking and reporting",
            category: "Analytics",
            short_description: "Real-time inventory insights",
            long_description: "Get detailed insights into your inventory with real-time tracking, low stock alerts, and comprehensive reporting.",
            main_image: "https://example.com/images/inventory-extension.png",
            price: "$49.99",
            isDeleted: false,
            createdAt: "2024-01-05T08:00:00.000Z",
            updatedAt: "2024-01-05T08:00:00.000Z",
            __v: 0
        }
    ];
    
    return {
        success: true,
        customExtensions: mockExtensions,
        timestamp: new Date().toISOString()
    };
};

