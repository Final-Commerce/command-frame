import { CFProjectName } from "../../CommonTypes";

export interface GetFinalContextResponse {
    projectName: CFProjectName | string;
}

export type GetFinalContext = () => Promise<GetFinalContextResponse | null>;

