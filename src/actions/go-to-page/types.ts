// Go to Page Types
export interface GoToPageParams {
    pageId: string;
}

export interface GoToPageResponse {
    success: boolean;
    pageId: string;
    timestamp: string;
}

export type GoToPage = (params?: GoToPageParams) => Promise<GoToPageResponse>;

