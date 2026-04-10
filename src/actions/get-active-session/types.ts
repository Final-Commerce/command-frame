import { CFSession } from "../../CommonTypes";

export interface GetActiveSessionResponse {
    success: boolean;
    session: CFSession | null;
    timestamp: string;
}

export type GetActiveSession = () => Promise<GetActiveSessionResponse>;
