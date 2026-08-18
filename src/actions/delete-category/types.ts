// Soft delete (spec §6.6).
export interface DeleteCategoryParams {
  categoryId: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  categoryId: string;
  timestamp: string;
}

export type DeleteCategory = (params: DeleteCategoryParams) => Promise<DeleteCategoryResponse>;
