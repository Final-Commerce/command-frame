export interface GetFinalContextResponse {
    projectName: string;
}

export type GetFinalContext = () => Promise<GetFinalContextResponse | null>;

