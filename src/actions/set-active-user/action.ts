import { commandFrameClient } from "../../client";
import type { SetActiveUser, SetActiveUserParams, SetActiveUserResponse } from "./types";

export const setActiveUser: SetActiveUser = async (
    params?: SetActiveUserParams
): Promise<SetActiveUserResponse> => {
    return await commandFrameClient.call<SetActiveUserParams, SetActiveUserResponse>("setActiveUser", params);
};
