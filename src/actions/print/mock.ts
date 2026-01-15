import { Print, PrintParams, PrintResponse } from "./types";

export const mockPrint: Print = async (params?: PrintParams): Promise<PrintResponse> => {
    console.log("[Mock] print called", params);

    if (!params) {
        throw new Error("Print parameters are required");
    }

    // Mock implementation - just log what would be printed
    switch (params.type) {
        case "image":
            console.log("[Mock] Would print image:", params.data.image?.substring(0, 50) + "...");
            break;
        case "html":
            console.log("[Mock] Would print HTML:", params.data.html?.substring(0, 100) + "...");
            break;
        case "selector":
            console.log("[Mock] Would print element with selector:", params.data.selector);
            break;
        case "receipt":
            console.log("[Mock] Would print receipt for order:", params.data.order);
            break;
    }

    return {
        success: true,
        timestamp: new Date().toISOString(),
        type: params.type
    };
};
