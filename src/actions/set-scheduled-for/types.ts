export interface SetScheduledForParams {
  /**
   * Order to schedule. Omit to target the live cart — including a cart that isn't an
   * order yet; the time is carried onto the order when it's created.
   */
  orderId?: string;
  /**
   * When the customer wants the order, as an ISO 8601 date-time with Z or an offset (e.g.
   * '2026-10-13T23:00:00.000Z' or '2026-10-13T19:00:00-04:00'), or null for as soon as possible.
   * Stored in UTC.
   */
  scheduledFor: string | null;
}

export interface SetScheduledForResponse {
  success: boolean;
  /** The order that was updated, or null when the live cart has no order yet. */
  orderId: string | null;
  /** The time after the call, normalised to UTC ISO 8601 — or null (as soon as possible). */
  scheduledFor: string | null;
  timestamp: string;
}

export type SetScheduledFor = (params: SetScheduledForParams) => Promise<SetScheduledForResponse>;
