import { CFOutletInfo } from "../../CommonTypes";

export interface GetOutletsResponse {
    outlets: CFOutletInfo[];
    timestamp: string;
}

export type GetOutlets = () => Promise<GetOutletsResponse>;
