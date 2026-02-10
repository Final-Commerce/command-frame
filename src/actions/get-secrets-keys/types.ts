export interface GetSecretsKeysParams {
  extensionId?: string;
}

export interface GetSecretsKeysResponse {
  keys: string[];
}

export type GetSecretsKeys = (params?: GetSecretsKeysParams) => Promise<GetSecretsKeysResponse>;
