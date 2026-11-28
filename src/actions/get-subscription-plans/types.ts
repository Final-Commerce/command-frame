// Get Subscription Plans Types
import type { SubscriptionPlanInterval } from '@final-commerce/common';
import type { CFProduct } from '../../CommonTypes';

/** A plan the merchant sells: what one subscription delivers each period, and the plan's own price for it. */
export interface SubscriptionPlanView {
  _id: string;
  name: string;
  /** Per period: a variant and how many. A composite line takes one set of picks per portion (`createSubscription`). */
  lines: { variantId: string; quantity: number }[];
  /** The price of one period, minor units of `currency`. Show it as it is; never sum the lines' catalogue prices. */
  unitAmount: number;
  currency: string;
  /** One period: `intervalCount` × `interval` (1 × week = weekly). */
  recurring: { interval: SubscriptionPlanInterval | `${SubscriptionPlanInterval}`; intervalCount: number };
}

export type GetSubscriptionPlansParams = Record<string, never>;

export interface GetSubscriptionPlansResponse {
  /** False when the host refused: no active company, offline, or the server failed. */
  success: boolean;
  reason?: string;
  /** The ACTIVE plans only, newest first; a switched-off plan is not offered for new subscriptions. */
  plans: SubscriptionPlanView[];
  /**
   * The products of the plans' lines as `getProducts` serves them on this till (a composite carries `composite`, ready
   * for the picker). A line whose variant is in none of them cannot be sold here (inactive, not sold in POS, hidden at
   * this outlet or deleted) — show that, do not drop the line.
   */
  products: CFProduct[];
  timestamp: string;
}

export type GetSubscriptionPlans = (params?: GetSubscriptionPlansParams) => Promise<GetSubscriptionPlansResponse>;
