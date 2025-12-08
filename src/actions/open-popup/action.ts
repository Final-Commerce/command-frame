/**
 * Open popup action
 * Calls the openPopup action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    OpenPopup,
    OpenPopupParams,
    OpenPopupResponse
} from "./types";

export const openPopup: OpenPopup = async (params?: OpenPopupParams): Promise<OpenPopupResponse> => {
    return await commandFrameClient.call<OpenPopupParams, OpenPopupResponse>("openPopup", params);
};

