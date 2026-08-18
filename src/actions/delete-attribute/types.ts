// Soft delete (spec §6.6).
export interface DeleteAttributeParams {
  attributeId: string;
}

export interface DeleteAttributeResponse {
  success: boolean;
  attributeId: string;
  timestamp: string;
}

export type DeleteAttribute = (params: DeleteAttributeParams) => Promise<DeleteAttributeResponse>;
