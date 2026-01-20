// Action: Get Public Key
import { commandFrameClient } from "../../client";
import type {
    GetPublicKey,
    GetPublicKeyResponse
} from "./types";

export const getPublicKey: GetPublicKey = async (): Promise<GetPublicKeyResponse> => {
    return await commandFrameClient.call<void, GetPublicKeyResponse>("getPublicKey");
};
