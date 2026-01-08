export interface DeleteCustomTableDataResponse {
    success: boolean;
    timestamp: string;
}

export interface DeleteCustomTableDataParams {
    tableName: string;
    rowId: string;
}

export type DeleteCustomTableData = (params?: DeleteCustomTableDataParams) => Promise<DeleteCustomTableDataResponse>;
