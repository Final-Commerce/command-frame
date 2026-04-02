import { UploadMedia, UploadMediaParams, UploadMediaResponse } from "./types";

export const mockUploadMedia: UploadMedia = async (params: UploadMediaParams): Promise<UploadMediaResponse> => {
    console.log("[Mock] uploadMedia called", params.filename, params.mimeType);

    return {
        success: true,
        url: `https://example.com/media/mock/${encodeURIComponent(params.filename)}`,
        id: "mock_upload_id",
        filename: params.filename,
        mimeType: params.mimeType,
        size: 1234,
        width: null,
        height: null,
        timestamp: new Date().toISOString()
    };
};
