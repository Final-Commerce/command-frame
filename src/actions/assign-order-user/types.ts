import type { CFOrderAssignedUser } from '../../CommonTypes';

export interface AssignOrderUserParams {
  /** Order to assign. Omit to target the live cart's order — it must already exist (parked, paid or transitioned). */
  orderId?: string;
  /**
   * User to assign (e.g. the driver), or null to unassign. Assigning replaces the current
   * assignee with the same `label`; the replaced one stays in the order's record, ended.
   */
  userId: string | null;
  /**
   * Why the user is assigned, free text — e.g. 'delivery'. Omit for an unlabeled assignment.
   * When unassigning, ends only this label's assignee; omit it to end every current assignment.
   */
  label?: string | null;
}

export interface AssignOrderUserResponse {
  success: boolean;
  orderId: string;
  /**
   * Everyone who has had the order after the call, oldest first. Entries without
   * `unassignedAt` are the current assignees.
   */
  assignedUser: CFOrderAssignedUser[];
  timestamp: string;
}

export type AssignOrderUser = (params: AssignOrderUserParams) => Promise<AssignOrderUserResponse>;
