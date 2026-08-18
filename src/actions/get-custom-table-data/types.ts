export interface GetCustomTableDataResponse<T = any> {
    success: boolean;
    data: T[];
    timestamp: string;
}

export interface GetCustomTableDataParams {
    /** Table name (kebab-case). Required — the handler throws if it is absent. */
    tableName: string;
    /** Optional query filter */
    query?: any;
    /** Pagination offset */
    offset?: number;
    /** Pagination limit */
    limit?: number;
}

export type GetCustomTableData = <T = any>(params?: GetCustomTableDataParams) => Promise<GetCustomTableDataResponse<T>>;
