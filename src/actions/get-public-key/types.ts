// Types: Get Public Key
export interface GetPublicKeyResponse {
    publicKey: string;
}

export type GetPublicKey = () => Promise<GetPublicKeyResponse>;
