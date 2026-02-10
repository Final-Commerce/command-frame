export interface GetSecretValParams {
  key: string;
  extensionId?: string;
}

export interface GetSecretValResponse {
  key: string;
  value: string;
}

export type GetSecretVal = (params: GetSecretValParams) => Promise<GetSecretValResponse>;
