// Refresh Resource Types (Manage host extension)

export interface RefreshResourceParams {
    /** Resource key used by the host data layer (e.g. Refine resource name). */
    resource: string;
}

export interface RefreshResourceResponse {
    success: boolean;
    timestamp: string;
}

export type RefreshResource = (params: RefreshResourceParams) => Promise<RefreshResourceResponse>;
