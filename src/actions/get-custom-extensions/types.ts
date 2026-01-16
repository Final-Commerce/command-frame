import { CustomExtension } from "../../common-types/custom-extensions";

// Get Custom Extensions Types
export interface GetCustomExtensionsResponse {
    success: boolean;
    customExtensions: CustomExtension[];
    timestamp: string;
}

export type GetCustomExtensions = () => Promise<GetCustomExtensionsResponse>;
