export interface SetSecretValParams {
  key: string;
  value: string;
  extensionId?: string;
}

export interface SetSecretValResponse {
  success: boolean;
}

export type SetSecretVal = (params: SetSecretValParams) => Promise<SetSecretValResponse>;
