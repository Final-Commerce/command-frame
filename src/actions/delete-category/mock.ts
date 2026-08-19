import { DeleteCategory, DeleteCategoryParams, DeleteCategoryResponse } from './types';
import { MOCK_CATEGORIES } from '../../demo/database';

export const mockDeleteCategory: DeleteCategory = async (
  params: DeleteCategoryParams,
): Promise<DeleteCategoryResponse> => {
  console.log('[Mock] deleteCategory called', params);

  const index = MOCK_CATEGORIES.findIndex((c) => c.id === params.categoryId);
  if (index !== -1) MOCK_CATEGORIES.splice(index, 1);

  return {
    success: true,
    categoryId: params.categoryId,
    timestamp: new Date().toISOString(),
  };
};
