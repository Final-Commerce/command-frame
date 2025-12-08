// Go to Station Home Types
export interface GoToStationHomeResponse {
    success: boolean;
    timestamp: string;
}

export type GoToStationHome = () => Promise<GoToStationHomeResponse>;

