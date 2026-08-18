// get-outlets — dropdown data (active company outlets)
export interface CFOutletSummary {
  _id: string;
  name: string;
  isDeleted?: boolean;
}

export interface GetOutletsResponse {
  success: boolean;
  outlets: CFOutletSummary[];
  timestamp: string;
}

export type GetOutlets = () => Promise<GetOutletsResponse>;
