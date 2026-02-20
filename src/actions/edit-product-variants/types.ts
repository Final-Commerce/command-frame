import { CFProductVariant } from "../../CommonTypes";

export interface EditProductVariantsParams {
    productId: string;
    additions?: Omit<CFProductVariant, '_id'>[];
    changes?: Array<{ _id: string; changes: Partial<CFProductVariant> }>;
    deletions?: string[];
}

export interface EditProductVariantsResponse {
    success: boolean;
    timestamp: string;
}

export type EditProductVariants = (params: EditProductVariantsParams) => Promise<EditProductVariantsResponse>;
