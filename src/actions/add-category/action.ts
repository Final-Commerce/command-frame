import { commandFrameClient } from '../../client';
import type { AddCategory, AddCategoryParams, AddCategoryResponse } from './types';

export const addCategory: AddCategory = async (params: AddCategoryParams): Promise<AddCategoryResponse> => {
  return await commandFrameClient.call<AddCategoryParams, AddCategoryResponse>('addCategory', params);
};
