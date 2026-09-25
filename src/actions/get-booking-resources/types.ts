import { CFBookingResource } from '../../CommonTypes';

export interface GetBookingResourcesParams {
  /** Only the resources that serve this bookable product. Omit for the whole company. */
  productId?: string;
  /** Only resources standing at this outlet (a resource with no outlet serves all of them). */
  outletId?: string;
}

export interface GetBookingResourcesResponse {
  resources: CFBookingResource[];
  timestamp: string;
}

export type GetBookingResources = (params?: GetBookingResourcesParams) => Promise<GetBookingResourcesResponse>;
