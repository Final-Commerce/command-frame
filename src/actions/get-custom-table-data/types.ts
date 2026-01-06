export interface GetCustomTableDataResponse<T = any> {
    success: boolean;
    data: T[];
    timestamp: string;
}

export interface GetCustomTableDataParams {
    tableName: string;
    query?: any;
    offset?: number;
    limit?: number;
}

export type GetCustomTableData = <T = any>(params?: GetCustomTableDataParams) => Promise<GetCustomTableDataResponse<T>>;
