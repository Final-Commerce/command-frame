import { CFSession } from "../../CommonTypes";

export interface SetActiveSessionParams {
    sessionId: string;
}

export interface SetActiveSessionResponse {
    success: boolean;
    session: CFSession;
    timestamp: string;
}

export type SetActiveSession = (params?: SetActiveSessionParams) => Promise<SetActiveSessionResponse>;
