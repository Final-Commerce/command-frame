/**
 * Example function action
 * Calls the exampleFunction action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ExampleFunction,
    ExampleFunctionParams,
    ExampleFunctionResponse
} from "./types";

export const exampleFunction: ExampleFunction = async (params?: ExampleFunctionParams): Promise<ExampleFunctionResponse> => {
    return await commandFrameClient.call<ExampleFunctionParams, ExampleFunctionResponse>("exampleFunction", params);
};

