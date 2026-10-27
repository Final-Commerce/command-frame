import { GetOutlets, GetOutletsParams, GetOutletsResponse } from "./types";
import { MOCK_OUTLETS, safeSerialize } from "../../demo/database";

/**
 * A second location that CANNOT take an online payment.
 *
 * The shared demo data has exactly one outlet, so without this a pickup picker
 * built against mocks would never render the case that matters: an outlet a
 * shopper must not be allowed to check out against. `setOutlet` refuses this id,
 * so the two mocks tell the same story.
 *
 * Mock-only, and deliberately NOT added to `MOCK_OUTLETS` — that array is shared
 * with every other outlet mock and `MOCK_OUTLET`.
 */
export const MOCK_UNCONNECTED_OUTLET_ID = "outlet-mock-unconnected";

const UNCONNECTED_OUTLET = {
    _id: MOCK_UNCONNECTED_OUTLET_ID,
    name: "Airport (not connected)",
    address: "2 Terminal Road",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postCode: "94128",
    connected: false
};

export const mockGetOutlets: GetOutlets = async (params?: GetOutletsParams): Promise<GetOutletsResponse> => {
    console.log("[Mock] getOutlets called", params);
    const outlets = safeSerialize(MOCK_OUTLETS).map((o) => ({
        _id: o._id || o.id,
        name: o.name || "",
        address: o.address,
        city: o.city,
        state: o.state,
        country: o.country,
        connected: true
    }));
    const all = [...outlets, UNCONNECTED_OUTLET];
    return {
        outlets: params?.connectedOnly ? all.filter((o) => o.connected) : all,
        timestamp: new Date().toISOString()
    };
};
