// Navigate To Types (Manage host extension)

export interface NavigateToParams {
    /** In-app path (must start with `/`). Hosts may restrict allowed prefixes. */
    path: string;
}

export interface NavigateToResponse {
    success: boolean;
    timestamp: string;
}

export type NavigateTo = (params: NavigateToParams) => Promise<NavigateToResponse>;
