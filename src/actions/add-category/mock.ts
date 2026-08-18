import { AddCategory, AddCategoryParams, AddCategoryResponse } from './types';
import { CFCategory } from '../../CommonTypes';
import { MOCK_CATEGORIES, MOCK_COMPANY, safeSerialize } from '../../demo/database';

export const mockAddCategory: AddCategory = async (params: AddCategoryParams): Promise<AddCategoryResponse> => {
  console.log('[Mock] addCategory called', params);

  const now = new Date().toISOString();
  const category: CFCategory = {
    id: params._id || 'mock_category_' + Date.now(),
    companyId: MOCK_COMPANY.id!,
    createdAt: now,
    updatedAt: now,
    name: params.name,
    description: params.description,
    image: params.image,
    parentId: params.parentId,
    menuOrder: params.menuOrder,
  };

  MOCK_CATEGORIES.push(category);

  return {
    success: true,
    category: safeSerialize(category),
    timestamp: now,
  };
};
