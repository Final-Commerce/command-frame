import type { CFActiveOrder } from '../../CommonTypes';
import type {
  GetRefundPlanParams,
  RefundPlanAmounts,
  RefundPlanBreakdown,
  RefundPlanRow,
  RefundPlanTaxLine,
} from './types';

// Demo derivation of `getRefundPlan`'s `rows` and `allocation.breakdown`, for
// local/standalone mode only. See the note on `mockGetRefundPlan`.

const minor = (v: number | null | undefined): number => Math.round(Number(v ?? 0)) || 0;

interface MockLine {
  total?: number | null;
  totalTax?: number | null;
  taxes?: { name?: string; percentage?: number; amount?: number | null }[] | null;
  discount?: {
    itemDiscounts?: { amount?: number | null }[] | null;
    cartDiscount?: { amount?: number | null } | null;
  } | null;
}

/** A line's whole-quantity money, reading `total` as tax-inclusive (the engine's reading). */
function lineAmounts(line: MockLine): RefundPlanAmounts {
  const tax = minor(line.totalTax);
  const itemDiscount = (line.discount?.itemDiscounts ?? []).reduce((s, d) => s + minor(d.amount), 0);
  const cartDiscount = minor(line.discount?.cartDiscount?.amount);
  const net = Math.max(0, minor(line.total) - tax);
  const taxes: RefundPlanTaxLine[] = (line.taxes ?? []).map((t) => ({
    name: String(t.name ?? 'Tax'),
    percentage: t.percentage,
    amount: minor(t.amount),
  }));
  return { subtotal: net + itemDiscount + cartDiscount, itemDiscount, cartDiscount, tax, taxes, total: net + tax };
}

function scale(a: RefundPlanAmounts, share: number): RefundPlanAmounts {
  if (share >= 1) return a;
  const r = (n: number) => Math.round(n * share);
  const out = {
    subtotal: r(a.subtotal),
    itemDiscount: r(a.itemDiscount),
    cartDiscount: r(a.cartDiscount),
    tax: r(a.tax),
    taxes: a.taxes.map((t) => ({ ...t, amount: r(t.amount) })),
  };
  return { ...out, total: out.subtotal - out.itemDiscount - out.cartDiscount + out.tax };
}

/** Every row of a demo order. The demo has no refund ledger, so everything is refundable. */
export function mockRefundRows(order: CFActiveOrder): RefundPlanRow[] {
  const rows: RefundPlanRow[] = [];
  for (const li of order.lineItems ?? []) {
    const itemKey = String(li.internalId || li.variantId || '');
    if (!itemKey || !(li.quantity > 0)) continue;
    rows.push({
      type: 'product',
      itemKey,
      label: String(li.name ?? 'Item'),
      ...(li.sku ? { sku: li.sku } : {}),
      ...(li.attributes ? { attributes: li.attributes } : {}),
      quantity: li.quantity,
      refundableQuantity: li.quantity,
      amounts: lineAmounts(li),
    });
  }
  for (const cs of order.customSales ?? []) {
    if (!cs.customSaleId || !(cs.quantity > 0)) continue;
    rows.push({
      type: 'customSale',
      itemKey: cs.customSaleId,
      label: String(cs.name ?? 'Custom sale'),
      quantity: cs.quantity,
      refundableQuantity: cs.quantity,
      amounts: lineAmounts(cs),
    });
  }
  for (const fee of order.cartFees ?? []) {
    const amount = minor(fee.amount);
    const tax = minor(fee.tax);
    rows.push({
      type: 'fee',
      itemKey: String(fee.id),
      label: String(fee.label || 'Cart fee'),
      quantity: 1,
      refundableQuantity: 1,
      amounts: { subtotal: amount, itemDiscount: 0, cartDiscount: 0, tax, taxes: [], total: amount + tax },
    });
  }
  for (const pm of order.paymentMethods ?? []) {
    const tip = minor(pm.tip?.amount);
    if (tip <= 0) continue;
    rows.push({
      type: 'tip',
      itemKey: pm.transactionId,
      label: 'Tip',
      paymentType: pm.paymentType,
      quantity: 1,
      refundableQuantity: 1,
      amounts: { subtotal: tip, itemDiscount: 0, cartDiscount: 0, tax: 0, taxes: [], total: tip },
    });
  }
  return rows;
}

/** The selection's breakdown; no `items` means everything, like the demo's full-refund legs. */
export function mockRefundBreakdown(rows: RefundPlanRow[], items?: GetRefundPlanParams['items']): RefundPlanBreakdown {
  const picked = new Map<string, number>((items ?? []).map((i) => [i.itemKey, i.quantity]));
  const selected = rows
    .map((row) => {
      const quantity = items?.length
        ? Math.min(picked.get(row.itemKey) ?? 0, row.refundableQuantity)
        : row.refundableQuantity;
      return { type: row.type, itemKey: row.itemKey, quantity, amounts: scale(row.amounts, quantity / row.quantity) };
    })
    .filter((r) => r.quantity > 0);

  const totals = { items: 0, discounts: 0, fees: 0, tax: 0, tip: 0, total: 0 };
  for (const r of selected) {
    const a = r.amounts;
    if (r.type === 'fee') totals.fees += a.subtotal;
    else if (r.type === 'tip') totals.tip += a.subtotal;
    else {
      totals.items += a.subtotal;
      totals.discounts += a.itemDiscount + a.cartDiscount;
    }
    totals.tax += a.tax;
    totals.total += a.total;
  }
  return { rows: selected, totals };
}
