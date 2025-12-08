// Example Function Types
export interface ExampleFunctionParams {
    param1?: string;
    param2?: string;
    param3?: string;
}

export interface ExampleFunctionResponse {
    receivedParams: ExampleFunctionParams;
    responsePayload: {
        field1: string;
        field2: string;
        field3: string;
    };
    timestamp: string;
    processed: boolean;
}

export type ExampleFunction = (params?: ExampleFunctionParams) => Promise<ExampleFunctionResponse>;

