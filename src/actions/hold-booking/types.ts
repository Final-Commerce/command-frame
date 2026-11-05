import { CFBooking } from '../../CommonTypes';

export interface HoldBookingParams {
  productId: string;
  /** Which resource serves it: a member of staff, a room, a scooter. */
  resourceId: string;
  /** Must be the START of a slot the host offered, ISO 8601. */
  startAt: string;
  /**
   * End of the window — the `endAt` of the slot you picked, or of the last slot in a stay.
   * Required: a window that cannot be lined up with the grid is refused, and the till
   * has no local copy of the rules to derive it from.
   */
  endAt: string;
  /** The variant being sold, when the flow already knows which one. */
  variantId?: string;
  /** Whom the booking is for. Omit for a walk-in. */
  customerId?: string;
}

export interface HoldBookingResponse {
  /** False when the command was refused — a taken window, a rule, a booking that is not yours. */
  success: boolean;
  /** Why it was refused, in words a cashier can act on. Absent on success. */
  reason?: string;
  /** The claim. `expiresAt` says how long it survives unpaid; `id` is what you confirm or cancel. */
  booking?: CFBooking;
  timestamp: string;
}

export type HoldBooking = (params: HoldBookingParams) => Promise<HoldBookingResponse>;
