import { CFActiveUser } from "../../CommonTypes";

export interface GetActiveUserResponse {
    success: boolean;
    user: CFActiveUser | null;
    timestamp: string;
}

export type GetActiveUser = () => Promise<GetActiveUserResponse>;
