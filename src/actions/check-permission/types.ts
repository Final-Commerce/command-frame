// Check Permission Types
//
// READ-ONLY query: does the ACTIVE user hold a named permission? Truth source
// is the runtime's hydrated active user (role + permissions from the synced
// `users`/`roles` collections). Use it to PRE-GATE UI (hide/disable a Refund
// button, show "You are not allowed to initiate refunds") — it is not the
// security boundary: mutating refund commands enforce `issue_refunds`
// runtime-side regardless (`REFUND_PERMISSION_DENIED: ` prefix).

export interface CheckPermissionParams {
  /** Permission name, e.g. 'issue_refunds'. */
  permission: string;
}

export interface CheckPermissionResponse {
  success: boolean;
  /** Echo of the permission that was checked. */
  permission: string;
  /**
   * True when the active user holds the permission — either explicitly on
   * their role, or implicitly because their user type does not carry a role
   * (company owner, final/org staff).
   */
  allowed: boolean;
  timestamp: string;
}

export type CheckPermission = (params: CheckPermissionParams) => Promise<CheckPermissionResponse>;
