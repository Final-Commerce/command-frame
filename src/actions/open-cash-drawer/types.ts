// Open Cash Drawer Types
export interface OpenCashDrawerResponse {
    success: boolean;
    timestamp: string;
}

export type OpenCashDrawer = () => Promise<OpenCashDrawerResponse>;

