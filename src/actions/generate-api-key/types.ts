export interface GenerateAPIKeyParams {
    companyId: string;
    name?: string;
    permissions?: string[];
}

export interface GenerateAPIKeyResponse {
    apiKey: string;
}

export type GenerateAPIKey = (params: GenerateAPIKeyParams) => Promise<GenerateAPIKeyResponse>;
