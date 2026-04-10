import { CFActiveOutlet } from "../../CommonTypes";

export interface SetActiveOutletParams {
    outletId: string;
}

export interface SetActiveOutletResponse {
    success: boolean;
    outlet: CFActiveOutlet;
    timestamp: string;
}

export type SetActiveOutlet = (params?: SetActiveOutletParams) => Promise<SetActiveOutletResponse>;
