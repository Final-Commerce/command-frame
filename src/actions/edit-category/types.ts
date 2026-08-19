import { CFCategory } from '../../CommonTypes';

export interface EditCategoryParams {
  categoryId: string;
  changes: {
    name?: string;
    description?: string;
    image?: string;
    parentId?: string | null;
    menuOrder?: number;
  };
}

export interface EditCategoryResponse {
  success: boolean;
  category: CFCategory;
  timestamp: string;
}

export type EditCategory = (params: EditCategoryParams) => Promise<EditCategoryResponse>;
