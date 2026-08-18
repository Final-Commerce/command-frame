/** The persisted custom-table row: your `data` fields plus the platform-generated identity. */
export type UpsertedCustomTableRow<T = any> = T & {
    /** Generated row id (present on both insert and update). */
    _id: string;
    /** ISO timestamp; present on insert. */
    createdAt?: string;
    /** ISO timestamp; set on every upsert. */
    updatedAt?: string;
};

export interface UpsertCustomTableDataResponse<T = any> {
    success: boolean;
    /** The PERSISTED row (with the generated `_id`/timestamps), not a bare echo of the input. */
    data: UpsertedCustomTableRow<T>;
    timestamp: string;
}

export interface UpsertCustomTableDataParams<T = any> {
    tableName: string;
    data: T;
}

export type UpsertCustomTableData = <T = any>(params?: UpsertCustomTableDataParams<T>) => Promise<UpsertCustomTableDataResponse<T>>;
