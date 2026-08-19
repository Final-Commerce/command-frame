import { commandFrameClient } from '../../client';
import type { EditCategory, EditCategoryParams, EditCategoryResponse } from './types';

export const editCategory: EditCategory = async (params: EditCategoryParams): Promise<EditCategoryResponse> => {
  return await commandFrameClient.call<EditCategoryParams, EditCategoryResponse>('editCategory', params);
};
