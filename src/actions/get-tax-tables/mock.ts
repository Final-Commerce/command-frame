import { GetTaxTables, GetTaxTablesResponse } from "./types";

export const mockGetTaxTables: GetTaxTables = async (): Promise<GetTaxTablesResponse> => {
    console.log("[Mock] getTaxTables called");

    return {
        taxTables: [
            {
                _id: "mock_table_1",
                name: "Standard",
                rates: [
                    { _id: "mock_rate_1", name: "GST", isCompounding: false },
                    { _id: "mock_rate_2", name: "PST", isCompounding: true }
                ]
            },
            {
                _id: "mock_table_2",
                name: "Zero",
                rates: [{ _id: "mock_rate_3", name: "Zero rated", isCompounding: false }]
            }
        ],
        timestamp: new Date().toISOString()
    };
};
