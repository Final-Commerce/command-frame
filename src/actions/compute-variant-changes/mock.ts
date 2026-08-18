import { CFProductVariant } from '../../CommonTypes';
import { ComputeVariantChanges, ComputeVariantChangesParams, ComputeVariantChangesResponse } from './types';

// Deep-equal via JSON — every diffed field is plain JSON-serializable data
// (numbers, strings, booleans, or arrays/objects of those).
const isEqual = <T>(a: T, b: T): boolean => JSON.stringify(a) === JSON.stringify(b);

export const mockComputeVariantChanges: ComputeVariantChanges = async (
  params: ComputeVariantChangesParams,
): Promise<ComputeVariantChangesResponse> => {
  console.log('[Mock] computeVariantChanges called', params);

  const originalById = new Map(params.original.map((v) => [v._id, v]));
  const changes: { _id: string; changes: Partial<CFProductVariant> }[] = [];

  params.edited.forEach((edited) => {
    const original = originalById.get(edited._id);
    if (!original) return;

    // Fields diffed (spec §3.2 findVariantChanges).
    const fieldChanges: Partial<CFProductVariant> = {};
    if (!isEqual(original.price, edited.price)) fieldChanges.price = edited.price;
    if (!isEqual(original.costPrice, edited.costPrice)) fieldChanges.costPrice = edited.costPrice;
    if (!isEqual(original.salePrice, edited.salePrice)) fieldChanges.salePrice = edited.salePrice;
    if (!isEqual(original.sku, edited.sku)) fieldChanges.sku = edited.sku;
    if (!isEqual(original.barcode, edited.barcode)) fieldChanges.barcode = edited.barcode;
    if (!isEqual(original.isOnSale, edited.isOnSale)) fieldChanges.isOnSale = edited.isOnSale;
    if (!isEqual(original.images, edited.images)) fieldChanges.images = edited.images;
    if (!isEqual(original.attributes, edited.attributes)) fieldChanges.attributes = edited.attributes;
    if (!isEqual(original.manageStock, edited.manageStock)) fieldChanges.manageStock = edited.manageStock;
    if (!isEqual(original.inventory, edited.inventory)) fieldChanges.inventory = edited.inventory;

    if (Object.keys(fieldChanges).length > 0) {
      changes.push({ _id: edited._id, changes: fieldChanges });
    }
  });

  return {
    success: true,
    changes,
    timestamp: new Date().toISOString(),
  };
};
