// Remove Order Note Types
export interface RemoveOrderNoteResponse {
    success: boolean;
    timestamp: string;
}

export type RemoveOrderNote = () => Promise<RemoveOrderNoteResponse>;
