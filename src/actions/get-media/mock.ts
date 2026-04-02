import { GetMedia, GetMediaParams, GetMediaResponse } from "./types";

const now = new Date().toISOString();

export const mockGetMedia: GetMedia = async (params?: GetMediaParams): Promise<GetMediaResponse> => {
    console.log("[Mock] getMedia called", params);

    const items = [
        {
            _id: "mock_media_1",
            url: "https://example.com/media/photo1.jpg",
            filename: "photo1.jpg",
            mimeType: "image/jpeg",
            size: 102400,
            folder: "images",
            title: "Sample photo",
            alt: "Sample",
            width: 800,
            height: 600,
            createdAt: now
        },
        {
            _id: "mock_media_2",
            url: "https://example.com/media/doc.pdf",
            filename: "doc.pdf",
            mimeType: "application/pdf",
            size: 51200,
            folder: "documents",
            createdAt: now
        }
    ];

    return {
        items,
        total: items.length,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 20,
        timestamp: new Date().toISOString()
    };
};
