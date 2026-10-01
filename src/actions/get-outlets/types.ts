import { CFOutletInfo } from "../../CommonTypes";

export interface GetOutletsParams {
    /**
     * Return only locations that can take an online payment. Storefront only.
     * Default `false`, so a flow sees every outlet and decides how to present
     * the ones it cannot sell from.
     */
    connectedOnly?: boolean;
}

export interface GetOutletsResponse {
    outlets: CFOutletInfo[];
    timestamp: string;
}

/**
 * List the company's outlets.
 *
 * ON A STOREFRONT this is the pickup picker's source. Each outlet carries
 * `connected`, and an outlet with `connected: false` cannot take a payment, so
 * `setOutlet` refuses it — filter those out rather than relying on the refusal.
 *
 * There are no coordinates on an outlet, so "closest branch" is not something
 * this can answer; sort on the address fields or let the shopper choose.
 */
export type GetOutlets = (params?: GetOutletsParams) => Promise<GetOutletsResponse>;
