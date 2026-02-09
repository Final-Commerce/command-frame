import { CFProjectName } from "../../CommonTypes";

export interface GetFinalContextResponse {
    projectName: CFProjectName;
}

export type GetFinalContext = () => Promise<GetFinalContextResponse | null>;

