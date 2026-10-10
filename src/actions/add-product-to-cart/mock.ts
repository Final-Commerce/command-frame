import { AddProductToCart, AddProductToCartParams, AddProductToCartResponse } from './types';
import {
  MOCK_CART,
  MOCK_OUTLET,
  mockCompositeAtOutlet,
  mockCompositeStockRefusal,
  mockHiddenProductIds,
  MOCK_PRODUCTS,
  buildCartLineModifiers,
  buildModifierRows,
  mockPublishEvent,
  mockBookableWindow,
  mockIsBookable,
} from '../../demo/database';
import { mockHoldBooking } from '../hold-booking/mock';
import { mockCancelBooking } from '../cancel-booking/mock';
import {
  CFActiveProduct,
  CFCartReservation,
  CFCartLineComponent,
  CFCartLineModifier,
  CFComposite,
  CFCompositePick,
  CFResolvedModifier,
} from '../../CommonTypes';
import type { ModifierSelection } from '../get-product-modifier-selections/types';
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

  // Same refusal as the host: the mark wins over stock and backorders, and no line is created.
  if (variant.unavailable) {
    return {
      success: false,
      reason: 'Marked unavailable',
      productId: product._id,
      variantId: variant._id,
      internalId: '',
      name: product.name,
      quantity: 0,
      rows: [],
      modifiersTotal: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // Composites: the host's refusals with its texts, then the same line it builds (kaching `buildCompositeLine`).
  let compositeLine: MockCompositeLine | undefined;
  if (product.composite || params?.composite?.length) {
    const ownTax = !product.taxTable;
    const picks = params?.composite ?? [];
    // What this outlet sells (the host's catalog-visibility rules).
    const composite = product.composite && mockCompositeAtOutlet(product.composite, undefined, params?.compositeSlot);
    const reason = !composite
      ? `${product.name} is not a composite: it takes no composite picks`
      : mockHiddenProductIds().has(product._id)
        ? `${product.name} is not sold at this outlet`
        : params?.modifiers?.length
          ? `${product.name} takes no modifiers of its own: send them on its picks (composite[].modifiers)`
          : ownTax && params?.fees?.some((fee) => fee.applyTaxes)
            ? `${product.name} is taxed by its items: a taxable fee on it has no table to inherit`
            : (mockNeedsDateRefusal(product.name, composite, params?.compositeSlot) ??
              compositePicksRefusal(composite, picks) ??
              undefined);
    const built = reason ?? mockCompositeLine(composite!, picks, ownTax);
    const line =
      typeof built !== 'string'
        ? (mockCompositeStockRefusal([
            ...MOCK_CART.products,
            { variantId: variant._id, quantity, components: built.components },
          ]) ?? built)
        : built;
    if (typeof line === 'string') {
      return {
        success: false,
        reason: line,
        productId: product._id,
        variantId: variant._id,
        internalId: '',
        name: product.name,
        quantity: 0,
        rows: [],
        modifiersTotal: 0,
        timestamp: new Date().toISOString(),
      };
    }
    compositeLine = line;
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

  // The spread above copied the PRODUCT's `modifiers` — a ResolvedModifier[] menu — into a
  // field that means "the choices this line carries" (CartLineModifier[]). Two different
  // shapes, one name. Drop it before anything reads the line, or every surface renders the
  // whole catalogue as if the cashier had picked all of it.
  delete (activeProduct as { modifiers?: unknown }).modifiers;
  // Same for the catalogue's `composite` picker: a cart line carries `components`, never the menu.
  delete (activeProduct as { composite?: unknown }).composite;

  // Keep the raw answers AND the priced rows, the same pair the real host writes. The cart
  // TOTAL is deliberately left alone: like a product fee (see add-product-fee), per-line
  // money is not accumulated by this mock — `total` stays Σ extendPrice(price, quantity).
  if (params?.modifiers?.length) {
    activeProduct.modifierSelections = params.modifiers;
    activeProduct.modifiers = buildCartLineModifiers(product.modifiers, params.modifiers, product.taxTable);
  }
  if (compositeLine) {
    activeProduct.price = compositeLine.price;
    activeProduct.components = compositeLine.components;
    if (compositeLine.modifiers.length) {
      activeProduct.modifiers = [...(activeProduct.modifiers ?? []), ...compositeLine.modifiers];
    }
  }

  // B41: every bookable component held in one step, or the add is refused and nothing is kept.
  const booked = compositeLine && (await mockHoldCompositeBookings(compositeLine, quantity, internalId, params));
  if (typeof booked === 'string') {
    return {
      success: false,
      reason: booked,
      productId: product._id,
      variantId: variant._id,
      internalId: '',
      name: product.name,
      quantity: 0,
      rows: [],
      modifiersTotal: 0,
      timestamp: new Date().toISOString(),
    };
  }
  if (booked?.length) MOCK_CART.reservations = [...(MOCK_CART.reservations ?? []), ...booked];

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

  // Display-ready modifier rows for the line that was just created, so a flow can
  // show what the modifiers added without re-reading the cart or multiplying.
  const { rows, modifiersTotal } = buildModifierRows(activeProduct.modifiers, quantity);

  return {
    success: true,
    productId: activeProduct.id,
    variantId: activeProduct.variantId,
    internalId: activeProduct.internalId,
    name: activeProduct.name,
    quantity: quantity,
    rows,
    modifiersTotal,
    timestamp: new Date().toISOString(),
  };
};

/** The host's pick checks (kaching `validateCompositePicks`), same order and texts; null = valid. */
export function compositePicksRefusal(composite: CFComposite, picks: CFCompositePick[]): string | null {
  if (!composite.available) {
    if (!composite.parts.length) return 'This composite has no parts on this till yet';
    const blocking = composite.parts.find(
      (part) => part.min > 0 && !part.items.some((item) => !item.unavailable || item.unavailable === 'by_date'),
    );
    // FT-151: a part blocked by the sold-out mark says so, as the host does.
    const marked = blocking?.items.find((item) => item.unavailable === 'marked_sold_out');
    if (marked) return `${marked.name}: marked sold out`;
    return blocking
      ? `${blocking.name ?? 'Choose'}: nothing can be picked at this outlet`
      : 'This composite is unavailable: a part it needs has nothing to pick';
  }
  const counts = new Map<string, number>();
  for (const pick of picks) {
    const quantity = pick.quantity ?? 1;
    const part = composite.parts.find((candidate) => candidate.items.some((item) => item._id === pick.itemId));
    const item = part?.items.find((candidate) => candidate._id === pick.itemId);
    if (!part || !item) return `Composite item ${pick.itemId} is not offered here`;
    if (!Number.isInteger(quantity) || quantity <= 0) return `${item.name}: quantity must be a positive whole number`;
    if (item.unavailable === 'by_date') return `${item.name}: choose a date and time`;
    if (item.unavailable === 'fully_booked') return `${item.name} is fully booked at that time`;
    if (item.unavailable === 'marked_sold_out') return `${item.name}: marked sold out`;
    if (item.unavailable) return `${item.name} is not available`;
    const choice = item.choices.find((candidate) => candidate.variantId === pick.variantId);
    if (!choice) return `${item.name}: that variant is not one of its choices`;
    // The picked product's own modifiers, by its own rules (B28).
    const modifiers = mockSelectionsRefusal(choice.modifiers ?? [], pick.modifiers ?? []);
    if (modifiers) return `${choice.name}: ${modifiers}`;
    counts.set(part._id, (counts.get(part._id) ?? 0) + quantity);
  }
  for (const part of composite.parts) {
    const count = counts.get(part._id) ?? 0;
    if (count < part.min)
      return `${part.name ?? 'Choose'}: pick ${part.min === part.max ? '' : 'at least '}${part.min}`;
    if (count > part.max) return `${part.name ?? 'Choose'}: pick at most ${part.max}`;
  }
  return null;
}

/** The host's modifier rules (kaching `validateModifiers.ts` `validateSelections`), same order and texts, at the demo
 *  outlet; null = valid. A copy — change both in one step. */
function mockSelectionsRefusal(modifiers: CFResolvedModifier[], selections: ModifierSelection[]): string | null {
  const outletId = MOCK_OUTLET.id;
  const sellable = (choice: CFResolvedModifier['choices'][number]) =>
    !(choice.unavailableOutletIds ?? []).includes(outletId);
  if (new Set(selections.map((selection) => selection.modifierId)).size !== selections.length) {
    return 'Duplicate selection for the same modifier';
  }
  if (selections.some((selection) => !modifiers.some((modifier) => modifier._id === selection.modifierId))) {
    return 'A selected modifier does not apply to this product';
  }
  for (const modifier of modifiers) {
    if (modifier.required && !modifier.choices.some(sellable)) {
      return `${modifier.name} is required, but nothing is sold at this outlet`;
    }
    const picked = selections.find((selection) => selection.modifierId === modifier._id)?.choices ?? [];
    for (const { choiceId, quantity } of picked) {
      const choice = modifier.choices.find((candidate) => candidate._id === choiceId);
      if (!choice) return `Unknown choice for ${modifier.name}`;
      if (!sellable(choice)) return `${choice.name} is not sold at this outlet`;
      if (!Number.isInteger(quantity) || quantity < 1)
        return `${choice.name}: quantity must be a positive whole number`;
      const takesQuantity =
        modifier.selectionType === 'quantity' || (modifier.selectionType === 'multiple' && modifier.allowQuantity);
      if (!takesQuantity && quantity !== 1) return `${modifier.name} does not take quantities`;
    }
    if (new Set(picked.map((choice) => choice.choiceId)).size !== picked.length)
      return `${modifier.name}: duplicate choice`;
    const units = picked.reduce((sum, choice) => sum + choice.quantity, 0);
    if (modifier.selectionType === 'single') {
      if (units > 1) return `${modifier.name}: pick one`;
      if (modifier.required && units < 1) return `${modifier.name} is required`;
      continue;
    }
    const min = modifier.required ? Math.max(1, modifier.min ?? 1) : 0;
    if (units < min) return `${modifier.name}: pick at least ${min}`;
    if (modifier.max != null && units > modifier.max) return `${modifier.name}: at most ${modifier.max}`;
  }
  return null;
}

/** The host's `picksStillNeeded` (kaching `resolveComposite.ts`): per part, what is left of its min; an Optional part
 *  left empty is not listed. A copy — change both in one step. */
export function mockPicksStillNeeded(composite: CFComposite, picks: CFCompositePick[]) {
  return composite.parts.flatMap((part) => {
    const count = picks
      .filter((pick) => part.items.some((item) => item._id === pick.itemId))
      .reduce((sum, pick) => sum + (pick.quantity ?? 1), 0);
    const needed = Math.max(0, part.min - count);
    return needed > 0 ? [{ partId: part._id, needed }] : [];
  });
}

type MockCompositeLine = { price: number; components: CFCartLineComponent[]; modifiers: CFCartLineModifier[] };

/** kaching `buildCompositeLine` (B31): a component's share of ONE composite = the composite price split by the picked
 *  variant's price × units (all 0 → units) + its own upcharge; Σ = price. Item modifiers flat with `componentIndex`
 *  and quantity × the component's units. A copy — change both in one step. */
export function mockCompositeLine(
  composite: CFComposite,
  picks: CFCompositePick[],
  ownTax: boolean,
): MockCompositeLine | string {
  const rows = picks.map((pick) => {
    const part = composite.parts.find((candidate) => candidate.items.some((item) => item._id === pick.itemId))!;
    const item = part.items.find((candidate) => candidate._id === pick.itemId)!;
    const choice = item.choices.find((candidate) => candidate.variantId === pick.variantId)!;
    const product = MOCK_PRODUCTS.find((candidate) => candidate._id === choice.productId);
    const variant = product?.variants.find((candidate) => candidate._id === choice.variantId);
    const selected = variant?.isOnSale ? variant.salePrice : variant?.price;
    return {
      part,
      item,
      choice,
      productName: product?.name ?? choice.name,
      taxTable: product?.taxTable || undefined,
      price: typeof selected === 'number' && Number.isFinite(selected) ? Math.round(selected) : null,
      pickQuantity: pick.quantity ?? 1,
      units: (pick.quantity ?? 1) * item.quantity,
    };
  });
  const unreadable = rows.find((row) => row.price === null);
  if (unreadable) return `${unreadable.productName}: its price cannot be read, so the composite cannot be split`;
  const base = composite.basePrice ?? 0;
  if (ownTax && rows.length === 0 && base > 0) return 'Pick at least one item: this composite is taxed by its items';
  const priced = rows.map((row) => row.price! * row.units);
  const weights = priced.some((weight) => weight > 0) ? priced : rows.map((row) => row.units);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  // Largest remainder, ties to the first — the host's allocateRateAcrossLines.
  const floors = weights.map((weight) => (totalWeight ? Math.floor((base * weight) / totalWeight) : 0));
  const ranked = weights
    .map((weight, index) => ({ index, remainder: totalWeight ? (base * weight) % totalWeight : 0 }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (let k = 0; k < (totalWeight ? base - floors.reduce((a, b) => a + b, 0) : 0); k++) floors[ranked[k].index] += 1;

  const components = rows.map((row, index) => ({
    ...(row.part.name ? { partName: row.part.name } : {}),
    productId: row.choice.productId,
    variantId: row.choice.variantId,
    name: row.choice.name,
    ...(row.choice.attributes.length ? { attributes: row.choice.attributes } : {}),
    quantity: row.units,
    unitPrice: row.item.cost * row.pickQuantity + floors[index],
    ...(ownTax && row.taxTable ? { taxTableId: row.taxTable } : {}),
  }));
  const modifiers = rows.flatMap((row, index) =>
    buildCartLineModifiers(row.choice.modifiers, picks[index].modifiers, row.taxTable).map((modifier) => ({
      ...modifier,
      quantity: modifier.quantity * row.units,
      componentIndex: index,
    })),
  );
  return { price: rows.reduce((sum, row) => sum + row.item.cost * row.pickQuantity, base), components, modifiers };
}

/**
 * The host's B41 step (kaching `holdCompositeBookings`): seats of one resource, else several, else refused; each hold a
 * price-0 reservation linked to the line. Returns the rows, or the refusal after releasing what it took.
 */
async function mockHoldCompositeBookings(
  line: MockCompositeLine,
  quantity: number,
  lineItemInternalId: string,
  params?: AddProductToCartParams,
): Promise<CFCartReservation[] | string> {
  const rows: CFCartReservation[] = [];
  const refuse = async (reason: string) => {
    for (const row of rows) await mockCancelBooking({ bookingId: row.bookingId });
    return reason;
  };
  for (const [componentIndex, component] of line.components.entries()) {
    if (!mockIsBookable(component.productId)) continue;
    if (!params?.compositeSlot) return refuse(`${component.name}: choose a date and time`);
    const seats = component.quantity * quantity;
    const { slot } = mockBookableWindow(component.productId, params.compositeSlot.startAt);
    const named = params.composite?.[componentIndex]?.resourceId;
    const resources = (slot?.resources ?? []).filter((resource) => !named || resource.resourceId === named);
    const whole = resources.find((resource) => resource.free >= seats);
    const plan = whole
      ? [{ resourceId: whole.resourceId, qty: seats }]
      : named
        ? []
        : resources
            .filter((resource) => resource.free > 0)
            .map((resource) => ({ resourceId: resource.resourceId, qty: resource.free }));
    let left = seats;
    const taken = plan.flatMap((entry) => {
      const qty = Math.min(entry.qty, left);
      left -= qty;
      return qty > 0 ? [{ ...entry, qty }] : [];
    });
    if (!slot || left > 0) return refuse(`${component.name}: ${seats} seat(s) are not free at that time`);
    for (const { resourceId, qty } of taken) {
      const held = await mockHoldBooking({
        productId: component.productId,
        resourceId,
        variantId: component.variantId,
        startAt: slot.startAt,
        endAt: slot.endAt,
      });
      if (!held.success || !held.booking) return refuse(`${component.name}: ${held.reason}`);
      rows.push({
        internalId: `res_${held.booking.id}`,
        bookingId: held.booking.id,
        productId: component.productId,
        variantId: component.variantId,
        resourceId,
        name: component.name,
        resourceName: held.booking.resourceName,
        price: 0,
        quantity: qty,
        total: 0,
        startAt: held.booking.startAt,
        endAt: held.booking.endAt,
        bufferEndAt: held.booking.bufferEndAt,
        expiresAt: held.booking.expiresAt,
        lineItemInternalId,
        componentIndex,
      });
    }
  }
  return rows;
}

/** The host's B41 refusal (kaching `loadCompositeLine`), word for word: a composite with a booking needs a slot. */
export function mockNeedsDateRefusal(name: string, composite: CFComposite, slot?: { startAt: string }): string | null {
  return composite.needsDate && !slot
    ? `${name} includes a booking: show a date and time picker (getCompositeAvailability) and pass compositeSlot to addProductToCart`
    : null;
}
