// Get Context Types
export interface GetContextResponse {
    userId: string | null;
    companyId: string | null;
    companyName: string | null;
    deviceId: string | null;
    stationId: string | null;
    stationName: string | null;
    outletId: string | null;
    outletName: string | null;
    buildId: string | null;
    buildName: string | null;
    buildVersion: string | null;
    buildSourceId: string | null;
    buildIsPremium: boolean;
    timestamp: string;
}

export type GetContext = () => Promise<GetContextResponse>;

