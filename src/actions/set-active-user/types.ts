import { CFActiveUser } from "../../CommonTypes";

export interface SetActiveUserParams {
    userId: string;
}

export interface SetActiveUserResponse {
    success: boolean;
    user: CFActiveUser;
    timestamp: string;
}

export type SetActiveUser = (params?: SetActiveUserParams) => Promise<SetActiveUserResponse>;
