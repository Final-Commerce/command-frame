// Get Tax Tables Types (Manage host extension)

export interface TaxRatePayload {
    _id: string;
    name: string;
    isCompounding: boolean;
}

export interface TaxTablePayload {
    _id: string;
    name: string;
    rates: TaxRatePayload[];
}

export interface GetTaxTablesResponse {
    taxTables: TaxTablePayload[];
    timestamp: string;
}

export type GetTaxTables = () => Promise<GetTaxTablesResponse>;
