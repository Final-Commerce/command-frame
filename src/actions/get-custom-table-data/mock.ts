import { GetCustomTableData, GetCustomTableDataParams, GetCustomTableDataResponse } from "./types";
import { MOCK_CUSTOM_TABLE_DATA } from "../../demo/mocks/custom-tables";

/**
 * The host's read (kaching get-custom-table-data/handler.ts, customTables.ts:99-113): the table's rows, offset 0 and
 * limit 100 by default, so a row upsertCustomTableData wrote is read back. The mock filters by plain field equality only
 * and refuses query operators rather than guess them.
 */
export const mockGetCustomTableData: GetCustomTableData = async <T = any>(
    params?: GetCustomTableDataParams
): Promise<GetCustomTableDataResponse<T>> => {
    console.log("[Mock] getCustomTableData called", params);
    if (!params?.tableName) throw new Error("tableName is required");

    const query: Record<string, unknown> = params.query ?? {};
    const operator = Object.entries(query).find(([key, value]) => key.startsWith("$") || (typeof value === "object" && value !== null));
    if (operator) {
        throw new Error(`The mock filters custom-table rows by plain field equality only; "${operator[0]}" is not modelled`);
    }
    const rows = (MOCK_CUSTOM_TABLE_DATA[params.tableName] ?? []).filter(row => Object.entries(query).every(([key, value]) => row[key] === value));
    const offset = params.offset || 0;
    return {
        success: true,
        data: rows.slice(offset, offset + (params.limit || 100)) as T[],
        timestamp: new Date().toISOString()
    };
};
