import { AddProductToCart, AddProductToCartParams, AddProductToCartResponse } from './types';
import { MOCK_CART, MOCK_PRODUCTS, mockPublishEvent } from '../../demo/database';
import { CFActiveProduct } from '../../CommonTypes';
import { extendPrice, isValidQuantity, resolveUnit } from '@final-commerce/common';

export const mockAddProductToCart: AddProductToCart = async (
  params?: AddProductToCartParams,
): Promise<AddProductToCartResponse> => {
  console.log('[Mock] addProductToCart called', params);

  const variantId = params?.variantId;
  const quantity = params?.quantity || 1;
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error(`${quantity} is not a quantity`);
  }

  let product = MOCK_PRODUCTS[0]; // Default fallback
  let variant = product.variants[0];

  // Determine variant and product from variantId
  if (variantId) {
    // Search through all products to find the one containing this variant
    for (const p of MOCK_PRODUCTS) {
      const foundVariant = p.variants.find((v) => v._id === variantId);
      if (foundVariant) {
        product = p;
        variant = foundVariant;
        break;
      }
    }
  }

  // A measured variant carries a resolved unit; the host does the same. What the unit can
  // express is its precision — 1.5 of a kilogram is a sale, 1.5 of a piece is a typo.
  const unit = variant.unitId ? resolveUnit(variant.unitId) : undefined;
  if (!isValidQuantity(quantity, unit ?? ({ unitId: 'piece', ratioToBase: 1, precision: 0 } as never))) {
    throw new Error(
      unit
        ? `${quantity} is finer than ${unit.abbreviation} can express (${unit.precision} decimals)`
        : `${product.name} is sold by the piece, so ${quantity} is not a quantity it can sell in`,
    );
  }

  // Add to MOCK_CART
  const internalId = product._id + '_' + Date.now();

  // Process optional fields for mock
  let note = undefined;
  if (params?.notes) {
    note = Array.isArray(params.notes) ? params.notes.join(', ') : params.notes;
  }

  const activeProduct: CFActiveProduct = {
    ...product,
    id: product._id,
    internalId: internalId, // unique ID for cart item
    variantId: variant._id,
    quantity: quantity,
    price: Number(variant.price),
    taxTableId: product.taxTable,
    stock: variant.inventory?.[0]?.stock || 0,
    ...(unit ? { unit } : {}),
    images: product.images || [],
    localQuantity: quantity,
    sku: variant.sku,
    attributes: variant.attributes.map((a) => `${a.name}: ${a.value}`).join(', '),
    note: note,
    // discount/fee could be added here to mock object if CFActiveProduct supports it
  } as unknown as CFActiveProduct;

  MOCK_CART.products.push(activeProduct);

  // Recalculate totals. extendPrice, not a raw multiply: a fractional quantity times an
  // integer-minor price leaves fractional cents, which no order may carry.
  const lineTotal = extendPrice(activeProduct.price, quantity);
  MOCK_CART.subtotal += lineTotal;
  // Simple total calculation (ignoring taxes/fees for mock simplicity unless needed)
  MOCK_CART.total += lineTotal;
  MOCK_CART.amountToBeCharged = MOCK_CART.total;
  MOCK_CART.remainingBalance = MOCK_CART.total;

  // Publish cart event to simulate real behavior
  mockPublishEvent('cart', 'product-added', { product: activeProduct });

  return {
    success: true,
    productId: activeProduct.id,
    variantId: activeProduct.variantId,
    internalId: activeProduct.internalId,
    name: activeProduct.name,
    quantity: quantity,
    timestamp: new Date().toISOString(),
  };
};
