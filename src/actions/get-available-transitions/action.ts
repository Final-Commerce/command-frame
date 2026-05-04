import { commandFrameClient } from "../../client";
import type {
    GetAvailableTransitions,
    GetAvailableTransitionsParams,
    GetAvailableTransitionsResponse,
} from "./types";

export const getAvailableTransitions: GetAvailableTransitions = async (
    params: GetAvailableTransitionsParams
): Promise<GetAvailableTransitionsResponse> => {
    return await commandFrameClient.call<
        GetAvailableTransitionsParams,
        GetAvailableTransitionsResponse
    >("getAvailableTransitions", params);
};
