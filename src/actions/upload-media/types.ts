// Upload Media Types (Manage host extension)

export interface UploadMediaParams {
    /** Base64-encoded file content (no data URL prefix). */
    base64: string;
    filename: string;
    mimeType: string;
    /** Target folder label; host default if omitted. */
    folder?: string;
}

export interface UploadMediaResponse {
    success: boolean;
    url: string;
    id?: string | null;
    filename?: string;
    mimeType?: string;
    size?: number;
    width?: number | null;
    height?: number | null;
    timestamp: string;
}

export type UploadMedia = (params: UploadMediaParams) => Promise<UploadMediaResponse>;
