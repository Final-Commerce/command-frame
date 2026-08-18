// Hard delete (unlike catalog entities in spec §6.6) — removes the file from
// storage host-side, not just a soft-deleted record.
export interface DeleteImageParams {
  attachmentId: string;
}

export interface DeleteImageResponse {
  success: boolean;
  attachmentId: string;
  timestamp: string;
}

export type DeleteImage = (params: DeleteImageParams) => Promise<DeleteImageResponse>;
