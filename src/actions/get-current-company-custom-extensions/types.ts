import { CustomExtension } from "../../common-types/custom-extensions";

export interface GetCurrentCompanyCustomExtensionsParams {
    
}

// Get Custom Extension Custom Tables Types
export interface GetCurrentCompanyCustomExtensionsResponse {
    success: boolean;
    customExtensions: CustomExtension[];
    timestamp: string;
}

export type GetCurrentCompanyCustomExtensions = (params: GetCurrentCompanyCustomExtensionsParams) => Promise<GetCurrentCompanyCustomExtensionsResponse>;
