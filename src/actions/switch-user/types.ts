// Switch User Types
export interface SwitchUserParams {
    mode: 'dialog' | 'role' | 'specific';
    /** Required if mode is 'role'. */
    roleIds?: string[];
    /** Required if mode is 'specific'. */
    userId?: string;
}

export interface SwitchUserResponse {
    success: boolean;
    mode: 'dialog' | 'role' | 'specific';
    roleIds?: string[];
    userId?: string;
    timestamp: string;
}

export type SwitchUser = (params?: SwitchUserParams) => Promise<SwitchUserResponse>;

