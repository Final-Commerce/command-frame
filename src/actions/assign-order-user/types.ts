import type { CFOrderAssignedUser } from '../../CommonTypes';

export interface AssignOrderUserParams {
  /** Order to assign. Omit to target the live cart's order — it must already exist (parked, paid or transitioned). */
  orderId?: string;
  /** User to assign (e.g. the driver), or null to unassign. Replaces any current assignee. */
  userId: string | null;
}

export interface AssignOrderUserResponse {
  success: boolean;
  orderId: string;
  /** The order's assignee after the call; null when unassigned. */
  assignedUser: CFOrderAssignedUser | null;
  timestamp: string;
}

export type AssignOrderUser = (params: AssignOrderUserParams) => Promise<AssignOrderUserResponse>;
