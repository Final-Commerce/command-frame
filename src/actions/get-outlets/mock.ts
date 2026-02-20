import { GetOutlets, GetOutletsResponse } from "./types";

export const mockGetOutlets: GetOutlets = async (): Promise<GetOutletsResponse> => {
    console.log("[Mock] getOutlets called");
    return {
        outlets: [
            {
                _id: "mock_outlet_001",
                name: "Main Store",
                address: "123 Commerce St",
                city: "New York",
                state: "NY",
                country: "US",
            },
            {
                _id: "mock_outlet_002",
                name: "Downtown Branch",
                address: "456 Market Ave",
                city: "San Francisco",
                state: "CA",
                country: "US",
            },
        ],
        timestamp: new Date().toISOString(),
    };
};
