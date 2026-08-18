import { EditCategory, EditCategoryParams, EditCategoryResponse } from './types';
import { MOCK_CATEGORIES, safeSerialize } from '../../demo/database';

export const mockEditCategory: EditCategory = async (params: EditCategoryParams): Promise<EditCategoryResponse> => {
  console.log('[Mock] editCategory called', params);

  const category = MOCK_CATEGORIES.find((c) => c.id === params.categoryId);
  if (!category) throw new Error(`Category not found: ${params.categoryId}`);

  const { name, description, image, parentId, menuOrder } = params.changes;
  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;
  if (parentId !== undefined) category.parentId = parentId ?? undefined;
  if (menuOrder !== undefined) category.menuOrder = menuOrder;
  category.updatedAt = new Date().toISOString();

  return {
    success: true,
    category: safeSerialize(category),
    timestamp: new Date().toISOString(),
  };
};
