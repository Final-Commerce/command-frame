import { CFActiveOutlet } from "../../CommonTypes";

export interface GetActiveOutletResponse {
    success: boolean;
    outlet: CFActiveOutlet | null;
    timestamp: string;
}

export type GetActiveOutlet = () => Promise<GetActiveOutletResponse>;
