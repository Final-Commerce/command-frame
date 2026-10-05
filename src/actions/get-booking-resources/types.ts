import { CFBookingResource } from '../../CommonTypes';

export interface GetBookingResourcesParams {
  /** Only the resources that serve this bookable product. Omit for the whole company. */
  productId?: string;
  /** Only resources standing at this outlet (a resource with no outlet serves all of them). */
  outletId?: string;
}

export interface GetBookingResourcesResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  resources?: CFBookingResource[];
  timestamp: string;
}

export type GetBookingResources = (params?: GetBookingResourcesParams) => Promise<GetBookingResourcesResponse>;
