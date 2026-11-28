// Create Subscription Types
import type { SubscriptionStatus } from '@final-commerce/common';
import type { CFCompositePick } from '../../CommonTypes';

/** The picks for `quantity` portions of one composite plan line, as `addProductToCart({ composite })` takes them. */
export interface SubscriptionPicksLine {
  /** The plan line's composite variant. */
  variantId: string;
  /** Portions with these picks. Entries may repeat a `variantId`; per variant they add up to the line's quantity. */
  quantity: number;
  picks: CFCompositePick[];
}

export interface CreateSubscriptionParams {
  /** Who subscribes: a customer's `_id` (`getCustomers`, `getActiveCustomer`). Never read from the cart. */
  customerId: string;
  /** An active plan from `getSubscriptionPlans`. The customer gets one subscription to it. */
  planId: string;
  /** Period 1's picks for every composite line of the plan. Becomes the period's snapshot; the server checks it. */
  picksSnapshot: SubscriptionPicksLine[];
}

export interface CreateSubscriptionResponse {
  /** False when the host refused: missing params, no active company, offline, or the server refused (its reason). */
  success: boolean;
  reason?: string;
  /** The new subscription. Absent when refused. */
  subscriptionId?: string;
  /** `incomplete` until period 1 is paid. Absent when refused. */
  status?: SubscriptionStatus | `${SubscriptionStatus}`;
  timestamp: string;
}

export type CreateSubscription = (params: CreateSubscriptionParams) => Promise<CreateSubscriptionResponse>;
