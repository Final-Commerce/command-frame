export interface GetCustomTableDataResponse<T = any> {
    success: boolean;
    data: T[];
    timestamp: string;
}

export interface GetCustomTableDataParams {
    /** Table name (kebab-case). Required if tableId is not provided. */
    tableName?: string;
    /** Table ID. Required if tableName is not provided. */
    tableId?: string;
    /** Optional query filter */
    query?: any;
    /** Pagination offset */
    offset?: number;
    /** Pagination limit */
    limit?: number;
}

export type GetCustomTableData = <T = any>(params?: GetCustomTableDataParams) => Promise<GetCustomTableDataResponse<T>>;
