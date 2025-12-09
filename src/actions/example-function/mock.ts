import { ExampleFunction, ExampleFunctionParams, ExampleFunctionResponse } from "./types";

export const mockExampleFunction: ExampleFunction = async (params?: ExampleFunctionParams): Promise<ExampleFunctionResponse> => {
    console.log("[Mock] exampleFunction called", params);
    
    return {
        receivedParams: params || {},
        responsePayload: {
            field1: "mock1",
            field2: "mock2",
            field3: "mock3"
        },
        timestamp: new Date().toISOString(),
        processed: true
    };
};

