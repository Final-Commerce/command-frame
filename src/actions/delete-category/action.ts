import { commandFrameClient } from '../../client';
import type { DeleteCategory, DeleteCategoryParams, DeleteCategoryResponse } from './types';

export const deleteCategory: DeleteCategory = async (params: DeleteCategoryParams): Promise<DeleteCategoryResponse> => {
  return await commandFrameClient.call<DeleteCategoryParams, DeleteCategoryResponse>('deleteCategory', params);
};
