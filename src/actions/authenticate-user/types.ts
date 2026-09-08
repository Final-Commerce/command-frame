// Authenticate User Types
export interface AuthenticateUserParams {
  /** Role IDs authorized for the gated action. The authenticating user must hold one of these. */
  roleIds: string[];
  /**
   * Headless validation: the id of the user whose PIN to verify. Provide together
   * with `pin` to validate the credentials in-process and return success/failure
   * WITHOUT showing kaching's PIN modal (the flow owns its own PIN UI). When
   * omitted, the modal flow is used. Must be paired with `pin`.
   */
  userId?: string;
  /**
   * Headless validation: the PIN to check against `userId`'s stored pincode.
   * Must be paired with `userId`. The user must also hold one of `roleIds`.
   */
  pin?: string;
}

export interface AuthenticateUserResponse {
  success: boolean;
  roleIds: string[];
  timestamp: string;
}

export type AuthenticateUser = (params?: AuthenticateUserParams) => Promise<AuthenticateUserResponse>;
