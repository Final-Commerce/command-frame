// get-product-visibility — CV semantics: listed outletIds are HIDDEN (presence = hidden, §6.4)
export interface GetProductVisibilityParams {
  productId: string;
}

export interface GetProductVisibilityResponse {
  success: boolean;
  hiddenOutletIds: string[];
  timestamp: string;
}

export type GetProductVisibility = (params: GetProductVisibilityParams) => Promise<GetProductVisibilityResponse>;
