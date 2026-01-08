import { CFCustomTableField } from "../../CommonTypes";

// Get Custom Table Fields Types
export interface GetCustomTableFieldsParams {
    tableId: string;
}

export interface GetCustomTableFieldsResponse {
    success: boolean;
    fields: CFCustomTableField[];
    timestamp: string;
}

export type GetCustomTableFields = (params: GetCustomTableFieldsParams) => Promise<GetCustomTableFieldsResponse>;

