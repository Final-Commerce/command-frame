export interface UpsertCustomTableDataResponse<T = any> {
    success: boolean;
    data: T;
    timestamp: string;
}

export interface UpsertCustomTableDataParams<T = any> {
    tableName: string;
    data: T;
}

export type UpsertCustomTableData = <T = any>(params?: UpsertCustomTableDataParams) => Promise<UpsertCustomTableDataResponse<T>>;
