// Get Media Types (Manage host extension)

export interface GetMediaParams {
    search?: string;
    mimeType?: string[];
    folder?: string;
    page?: number;
    pageSize?: number;
    sortBy?: "createdAt" | "filename" | "size" | "title";
    sortDir?: "asc" | "desc";
}

export interface MediaItemPayload {
    _id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    folder: string;
    title?: string;
    alt?: string;
    width?: number;
    height?: number;
    createdAt: string;
}

export interface GetMediaResponse {
    items: MediaItemPayload[];
    total: number;
    page: number;
    pageSize: number;
    timestamp: string;
}

export type GetMedia = (params?: GetMediaParams) => Promise<GetMediaResponse>;
