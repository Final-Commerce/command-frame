import { CFCustomTable } from "../../common-types/custom-tables";

export interface GetCustomExtensionCustomTablesParams {
    extensionId: string;
}

// Get Custom Extension Custom Tables Types
export interface GetCustomExtensionCustomTablesResponse {
    success: boolean;
    customTables: CFCustomTable[];
    timestamp: string;
}

export type GetCustomExtensionCustomTables = (params: GetCustomExtensionCustomTablesParams) => Promise<GetCustomExtensionCustomTablesResponse>;
