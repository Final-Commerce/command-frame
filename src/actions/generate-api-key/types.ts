export interface GenerateAPIKeyParams {
    companyId: string;
}

export interface GenerateAPIKeyResponse {
    apiKey: string;
}

export type GenerateAPIKey = (params: GenerateAPIKeyParams) => Promise<GenerateAPIKeyResponse>;
