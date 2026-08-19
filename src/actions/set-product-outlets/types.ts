// setProductOutlets — declarative catalog-visibility (CV) reconcile (spec §3.3.4 /
// §6.4). Presence of a live CV doc = HIDDEN; absence = visible.
export interface SetProductOutletsParams {
  productId: string;
  availableOutletIds: string[];
}

export interface SetProductOutletsResponse {
  success: boolean;
  hiddenOutletIds: string[];
  shownOutletIds: string[];
  timestamp: string;
}

export type SetProductOutlets = (params: SetProductOutletsParams) => Promise<SetProductOutletsResponse>;
