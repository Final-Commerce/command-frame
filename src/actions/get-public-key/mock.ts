// Mock: Get Public Key
import { GetPublicKey, GetPublicKeyResponse } from "./types";

export const mockGetPublicKey: GetPublicKey = async (): Promise<GetPublicKeyResponse> => {
    console.log("[Mock] getPublicKey called");
    return {
        publicKey: "mock-public-key-12345"
    };
};
