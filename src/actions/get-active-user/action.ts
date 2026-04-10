import { commandFrameClient } from "../../client";
import type { GetActiveUser, GetActiveUserResponse } from "./types";

export const getActiveUser: GetActiveUser = async (): Promise<GetActiveUserResponse> => {
    return await commandFrameClient.call<GetActiveUserResponse>("getActiveUser");
};
