import { CFCustomTable } from "../../CommonTypes";

// Get Current Cart Types
export interface GetCustomTablesResponse {
    success: boolean;
    customTables: CFCustomTable[];
    timestamp: string;
}

export type GetCustomTables = () => Promise<GetCustomTablesResponse>;
