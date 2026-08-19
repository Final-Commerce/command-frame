import { CFProductVariant } from '../../CommonTypes';
import { PreviewVariants, PreviewVariantsParams, PreviewVariantsResponse } from './types';

// Module-level counter so client-generated ids never collide across calls
// (a per-call index would repeat `mock-variant-0` on every invocation).
let variantIdCounter = 0;

// Stable dedup key for an attribute set, e.g. "Color:Red|Size:S" (spec §3.2 serializeAttributes).
const serializeAttributes = (attributes: { name: string; value?: string }[]): string =>
  attributes
    .map((a) => `${a.name}:${a.value ?? ''}`)
    .sort()
    .join('|');

// Cartesian product of each option's values, in option order.
const buildCombinations = (
  selectedOptions: { name: string; values: string[] }[],
): { name: string; value: string }[][] =>
  selectedOptions.reduce<{ name: string; value: string }[][]>(
    (combos, option) =>
      combos.flatMap((combo) => option.values.map((value) => [...combo, { name: option.name, value }])),
    [[]],
  );

export const mockPreviewVariants: PreviewVariants = async (
  params: PreviewVariantsParams,
): Promise<PreviewVariantsResponse> => {
  console.log('[Mock] previewVariants called', params);

  const { selectedOptions, existingVariants = [], defaults } = params;
  const combinations = selectedOptions.length > 0 ? buildCombinations(selectedOptions) : [];

  const existingByFingerprint = new Map<string, CFProductVariant>();
  existingVariants.forEach((v) => {
    if (v.attributes && v.attributes.length > 0) {
      existingByFingerprint.set(serializeAttributes(v.attributes), v);
    }
  });

  const additions: PreviewVariantsResponse['additions'] = [];
  const existing: CFProductVariant[] = [];

  combinations.forEach((attributes) => {
    const match = existingByFingerprint.get(serializeAttributes(attributes));
    if (match) {
      existing.push(match);
      return;
    }

    const variantId = `mock-variant-${++variantIdCounter}`;
    additions.push({
      _id: variantId,
      sku: '',
      price: defaults.price,
      salePrice: 0,
      isOnSale: false,
      manageStock: false,
      externalId: variantId,
      attributes,
      images: [],
      metadata: [],
      allowBackorder: false,
      inventory: defaults.outletIds.map((outletId) => ({ warehouse: 'main', outletId, stock: 0 })),
    });
  });

  // The simple-product placeholder (no attributes) is only stale once real combos
  // are about to replace it.
  const autoDeleteIds =
    additions.length > 0
      ? existingVariants.filter((v) => !v.attributes || v.attributes.length === 0).map((v) => v._id)
      : [];

  return {
    success: true,
    additions,
    existing,
    autoDeleteIds,
    timestamp: new Date().toISOString(),
  };
};
