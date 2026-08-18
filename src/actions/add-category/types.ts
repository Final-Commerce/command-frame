import { CFCategory } from '../../CommonTypes';

export interface AddCategoryParams {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  menuOrder?: number;
  /** Honor a caller-generated ObjectId. */
  _id?: string;
}

export interface AddCategoryResponse {
  success: boolean;
  category: CFCategory;
  timestamp: string;
}

export type AddCategory = (params: AddCategoryParams) => Promise<AddCategoryResponse>;
