/**
 * The mock host's cart money: a COPY of the part of kaching's `calculateCartTax` (src/utils/tax.ts) a flow can get
 * wrong, so a flow built on the mock sees the host's tax, discounts and totals. command-frame cannot import kaching
 * (kaching depends on it), so the arithmetic is copied, never re-derived: change it together with the kaching file:line
 * named on each piece. Not copied: the non-pooled cart-fee branch (a fee with no positive base keeps 0 tax here).
 */
import { extendPrice } from '@final-commerce/common';
import type { ActiveCart, ActiveProduct, TaxTableActive } from '@final-commerce/common/pos-types';

/** One rate of a tax table as the host holds it after resolving the outlet (kaching `activeEntities.tax.tables`). */
export type MockTaxRate = Pick<
  TaxTableActive,
  'id' | 'name' | 'rate' | 'priority' | 'compounding' | 'taxTableId' | 'taxTableName'
>;
export interface MockTaxDetails {
  taxIncl: boolean;
  tables: Record<string, MockTaxRate[]>;
}

export interface MockTaxBucket {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  taxTableId: string;
  taxTableName: string;
}
export interface MockLineMath {
  lineDisplayWithFee: number;
  prodDiscounts: { amount: number; percentage: number; label?: string }[];
  cartDiscountAllocated: number;
  cartDiscountPercentage: number;
  lineAfterCartDiscount: number;
  taxes: MockTaxBucket[];
  tax: number;
  total: number;
  /** Each modifier row's money and its own tax, as the engine leaves it on `ProdModifierBreakdown` (tax.ts:675-688). */
  modifiers: {
    amount: number;
    tax: number;
    taxes: (MockTaxBucket & Pick<MockTaxRate, 'compounding' | 'priority'>)[];
  }[];
}
export interface MockCartMath {
  subtotal: number;
  discountAmount: number;
  totalDiscount: number;
  tax: number;
  total: number;
  totalTaxes: MockTaxBucket[];
  /** Products and bookings by internalId, custom sales by id. */
  lines: Record<string, MockLineMath>;
  cartFees: { amount: number; feeTax: number }[];
}

// ── kaching src/utils/taxIntegerMath.ts, copied ──
const RATE_SCALE = 1_000_000n;
const MULT_SCALE = 1_000_000_000n;
const rateScaled = (rate: number): bigint => BigInt(Math.round(rate * Number(RATE_SCALE)));
const minorMul = (a: number, b: number): number => Number(BigInt(Math.round(a)) * BigInt(Math.round(b)));

/** taxIntegerMath.ts:38-43 */
export function allocShareMinor(amountMinor: number, linePartMinor: number, wholeMinor: number): number {
  if (wholeMinor <= 0) return 0;
  const n = BigInt(Math.round(amountMinor)) * BigInt(Math.round(linePartMinor));
  const d = BigInt(Math.round(wholeMinor));
  return Number((n + d / 2n) / d);
}

/** taxIntegerMath.ts:81-91 */
export function minorRateOfAmount(amountMinor: number, rate: number): number {
  if (amountMinor === 0 || rate <= 0) return 0;
  const prod = BigInt(Math.round(amountMinor)) * rateScaled(rate);
  const abs = prod < 0n ? -prod : prod;
  const q = (abs + RATE_SCALE / 2n) / RATE_SCALE;
  return Number(prod < 0n ? -q : q);
}

/** taxIntegerMath.ts:103-138 — half to even, the ONE rounding per rate. */
function minorRateOfAmountBankers(amountMinor: number, rate: number): number {
  if (amountMinor === 0 || rate <= 0) return 0;
  const prod = BigInt(Math.round(amountMinor)) * rateScaled(rate);
  const abs = prod < 0n ? -prod : prod;
  const q = abs / RATE_SCALE;
  const twiceR = (abs % RATE_SCALE) * 2n;
  const rounded = twiceR < RATE_SCALE ? q : twiceR > RATE_SCALE ? q + 1n : q % 2n === 0n ? q : q + 1n;
  return Number(prod < 0n ? -rounded : rounded);
}

/** taxIntegerMath.ts:164-192 — largest remainder: Σ result === target. */
export function allocateRateAcrossLines(bases: number[], targetMinor: number): number[] {
  const target = Math.max(0, Math.round(targetMinor));
  const whole = bases.map((b) => Math.max(0, Math.round(b)));
  const total = whole.reduce((a, b) => a + b, 0);
  if (!bases.length || target === 0 || total === 0) return bases.map(() => 0);
  const raws = whole.map((b, i) => {
    const num = BigInt(target) * BigInt(b);
    const floor = Number(num / BigInt(total));
    return { i, floor, rem: num - BigInt(floor) * BigInt(total) };
  });
  const out = raws.map((r) => r.floor);
  const residue = target - out.reduce((a, b) => a + b, 0);
  const ranked = [...raws].sort((a, b) => (b.rem === a.rem ? a.i - b.i : Number(b.rem - a.rem)));
  for (let k = 0; k < residue; k++) out[ranked[k].i] += 1;
  return out;
}

/** taxIntegerMath.ts:207-219 */
function buildInclusiveMultiplierScaled(rates: MockTaxRate[]): bigint {
  let m = MULT_SCALE;
  for (const t of [...rates].sort((a, b) => a.priority - b.priority)) {
    if (t.rate <= 0) continue;
    const r = BigInt(Math.round(t.rate * Number(MULT_SCALE)));
    m = t.compounding ? (m * (MULT_SCALE + r)) / MULT_SCALE : m + r;
  }
  return m;
}

/** taxIntegerMath.ts:222-226 */
function inclusiveGrossToNetMinor(grossMinor: number, multiplierScaled: bigint): number {
  if (multiplierScaled <= 0n) return Math.round(grossMinor);
  return Number((BigInt(Math.round(grossMinor)) * MULT_SCALE + multiplierScaled / 2n) / multiplierScaled);
}

/** taxIntegerMath.ts:253-256 — display only, not money. */
const ratioForDisplay = (part: number, whole: number): number =>
  whole === 0 ? 0 : Number((BigInt(Math.round(part)) * 1_000_000n) / BigInt(Math.round(whole))) / 1_000_000;

/** taxIntegerMath.ts:275-282 — nearest multiple of the increment, half up. */
export function cashRoundToIncrement(amountMinor: number, incrementMinor: number): number {
  const inc = Math.round(incrementMinor);
  if (inc <= 0) return Math.round(amountMinor);
  const a = BigInt(Math.round(amountMinor));
  const t = BigInt(inc);
  return Number(((a + t / 2n) / t) * t);
}

// ── kaching src/utils/tax.ts calculateCartTax, the parts below ──

/** One taxable base of a line: its product money, a component's share, or one modifier / fee row (tax.ts:478-490). */
interface RateContext {
  lineId: string;
  accKey: string;
  base: number;
  taxTableId: string;
  rates: MockTaxRate[];
  modifierIndex?: number;
}

/** tax.ts:54-55, 76-84 — a line's own discounts, capped at the line. */
const productDiscounts = (p: ActiveProduct, lineTotal: number) =>
  (p.discounts ?? []).map((d) => {
    const amount = d.isPercent ? minorRateOfAmount(lineTotal, d.value) : minorMul(d.value, p.quantity);
    return {
      amount,
      percentage: d.isPercent ? d.value : lineTotal > 0 ? ratioForDisplay(amount, lineTotal) : 0,
      label: d.label,
    };
  });

/** tax.ts:57-58, 133-146 */
const productFees = (p: ActiveProduct, base: number) =>
  (p.fees ?? []).map((f) => ({
    amount: f.isPercent ? minorRateOfAmount(base, f.amount) : minorMul(f.amount, p.quantity),
    applyTaxes: f.applyTaxes,
    taxTableId: f.taxTableId,
  }));

/** tax.ts:66-67, 109-122 */
const modifierRows = (p: ActiveProduct) =>
  (p.modifiers ?? []).map((m) => ({
    amount: extendPrice(minorMul(m.unitPrice, m.quantity), p.quantity),
    taxTableId: m.taxTableId,
  }));

interface Pass1Line {
  id: string;
  product?: ActiveProduct;
  index: number;
  /** The line's own discounts together, capped at the line (tax.ts:76-84). */
  productDiscount: number;
  lineDisplayBase: number;
  fees: { amount: number; applyTaxes?: boolean; taxTableId?: string }[];
  modifiers: { amount: number; taxTableId?: string }[];
  math: MockLineMath;
}

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

/** PASS 1 (tax.ts:249-358): each line's display money — after its own discounts, with its fees and modifiers. */
function buildLines(cart: ActiveCart, productLines: ActiveProduct[]): Pass1Line[] {
  const products = productLines.map((p, index): Pass1Line => {
    const original = extendPrice(p.price, p.quantity);
    const prodDiscounts = productDiscounts(p, original);
    const productDiscount = Math.min(sum(prodDiscounts.map((d) => d.amount)), original);
    const lineDisplayBase = Math.max(0, original - productDiscount);
    const fees = productFees(p, lineDisplayBase);
    const modifiers = modifierRows(p);
    const display = lineDisplayBase + sum(fees.map((f) => f.amount)) + sum(modifiers.map((m) => m.amount));
    const math = emptyLine(display, prodDiscounts, modifiers);
    return { id: p.internalId || p.id, product: p, index, productDiscount, lineDisplayBase, fees, modifiers, math };
  });
  const sales = (cart.customSales ?? []).map((sale, i): Pass1Line => {
    const display = extendPrice(sale.price, sale.quantity);
    const math = emptyLine(display, [], []);
    return {
      id: sale.id,
      index: productLines.length + i,
      productDiscount: 0,
      lineDisplayBase: display,
      fees: [],
      modifiers: [],
      math,
    };
  });
  return [...products, ...sales];
}

const emptyLine = (
  display: number,
  prodDiscounts: MockLineMath['prodDiscounts'],
  modifiers: { amount: number }[],
): MockLineMath => ({
  lineDisplayWithFee: display,
  prodDiscounts,
  cartDiscountAllocated: 0,
  cartDiscountPercentage: 0,
  lineAfterCartDiscount: display,
  taxes: [],
  tax: 0,
  total: 0,
  modifiers: modifiers.map((m) => ({ amount: m.amount, tax: 0, taxes: [] })),
});

/** PASS 2 (tax.ts:363-425): the cart discount, split by each line's share; the residue to the largest line. */
function allocateCartDiscount(cart: ActiveCart, lines: Pass1Line[], subtotal: number): number {
  const discount = cart.discount;
  if (!discount || !(discount.value > 0)) return 0;
  const amount = discount.isPercent
    ? minorRateOfAmount(subtotal, discount.value)
    : Math.min(Math.round(discount.value), subtotal);
  if (amount <= 0 || subtotal <= 0) return amount;
  const shares = lines.map((line) => allocShareMinor(amount, line.math.lineDisplayWithFee, subtotal));
  const residue = amount - sum(shares);
  if (residue !== 0) {
    let best = 0;
    lines.forEach((line, i) => {
      if (line.math.lineDisplayWithFee > lines[best].math.lineDisplayWithFee) best = i;
    });
    shares[best] += residue;
  }
  lines.forEach((line, i) => {
    const m = line.math;
    m.cartDiscountAllocated = shares[i];
    m.lineAfterCartDiscount = Math.max(0, m.lineDisplayWithFee - shares[i]);
    m.cartDiscountPercentage = discount.isPercent
      ? discount.value
      : m.lineDisplayWithFee > 0
        ? ratioForDisplay(shares[i], m.lineDisplayWithFee)
        : 0;
  });
  return amount;
}

/** PASS 3 sub-pass A (tax.ts:469-622): a product line's taxable bases — product money, components, modifier and fee rows. */
function productRateContexts(line: Pass1Line, tax: MockTaxDetails): RateContext[] {
  const p = line.product!;
  const after = line.math.lineAfterCartDiscount;
  const ownTaxComposite = !p.taxTableId && !!p.components?.length;
  const lineRates = p.taxTableId ? (tax.tables[p.taxTableId] ?? []) : [];
  if (!ownTaxComposite && lineRates.length === 0) return [];

  const feeDisplay = sum(line.fees.map((f) => f.amount));
  const modifierDisplay = sum(line.modifiers.map((m) => m.amount));
  const display = line.math.lineDisplayWithFee;
  let productPortion = after;
  let feePortion = 0;
  let modifierPortion = 0;
  if ((feeDisplay > 0 || modifierDisplay > 0) && line.math.cartDiscountAllocated > 0 && display > 0) {
    productPortion = allocShareMinor(after, line.lineDisplayBase, display);
    feePortion =
      modifierDisplay > 0 ? (feeDisplay > 0 ? allocShareMinor(after, feeDisplay, display) : 0) : after - productPortion;
    modifierPortion = modifierDisplay > 0 ? after - productPortion - feePortion : 0;
  } else if (feeDisplay > 0 || modifierDisplay > 0) {
    productPortion = line.lineDisplayBase;
    feePortion = feeDisplay;
    modifierPortion = modifierDisplay;
  }

  const net = (gross: number, rates: MockTaxRate[]) =>
    tax.taxIncl ? inclusiveGrossToNetMinor(gross, buildInclusiveMultiplierScaled(rates)) : gross;
  const contexts: RateContext[] = [];
  const push = (accKey: string, gross: number, tableId: string | undefined, modifierIndex?: number) => {
    const rates = tableId ? (tax.tables[tableId] ?? []) : [];
    if (gross > 0 && rates.length)
      contexts.push({ lineId: line.id, accKey, base: net(gross, rates), taxTableId: tableId!, rates, modifierIndex });
  };
  if (ownTaxComposite) {
    const portions = allocateRateAcrossLines(
      p.components!.map((c) => c.unitPrice),
      productPortion,
    );
    p.components!.forEach((c, i) => push(`${line.id}#${i}`, portions[i], c.taxTableId));
  } else if (lineRates.length) {
    contexts.push({
      lineId: line.id,
      accKey: line.id,
      base: net(productPortion, lineRates),
      taxTableId: p.taxTableId!,
      rates: lineRates,
    });
  }
  pushRowShares(line.modifiers, modifierPortion, modifierDisplay, (share, row, i) =>
    push(`${line.id}#modifier${i}`, share, row.taxTableId || p.taxTableId, i),
  );
  pushRowShares(line.fees, feePortion, feeDisplay, (share, row, i) => {
    if (row.applyTaxes) push(`${line.id}#fee${i}`, share, row.taxTableId || p.taxTableId);
  });
  return contexts;
}

/** tax.ts:598-622: a portion over its rows by their amounts, the last row taking the exact remainder. */
function pushRowShares<Row extends { amount: number }>(
  rows: Row[],
  portion: number,
  display: number,
  take: (share: number, row: Row, i: number) => void,
) {
  if (!rows.length || portion <= 0 || display <= 0) return;
  let left = portion;
  rows.forEach((row, i) => {
    const share = i === rows.length - 1 ? left : allocShareMinor(portion, row.amount, display);
    left -= share;
    take(share, row, i);
  });
}

/** Custom-sale bases (tax.ts:738-757). */
function saleRateContexts(cart: ActiveCart, lines: Record<string, MockLineMath>, tax: MockTaxDetails): RateContext[] {
  return (cart.customSales ?? []).flatMap((sale) => {
    const rates = sale.applyTaxes && sale.taxTableId ? (tax.tables[sale.taxTableId] ?? []) : [];
    if (!rates.length) return [];
    const gross = lines[sale.id].lineAfterCartDiscount;
    const base = tax.taxIncl ? inclusiveGrossToNetMinor(gross, buildInclusiveMultiplierScaled(rates)) : gross;
    return [{ lineId: sale.id, accKey: sale.id, base, taxTableId: sale.taxTableId!, rates }];
  });
}

/**
 * PASS 3 sub-pass B (tax.ts:627-711): per table, per rate in priority order — ONE half-to-even rounding over the rate's
 * whole base, then largest-remainder shares back to the bases. Compounding rates add the base's earlier tax.
 */
function applyRates(
  contexts: RateContext[],
  onShare: (ctx: RateContext, rate: MockTaxRate, share: number) => void,
  onRate: (rate: MockTaxRate, rateTax: number) => void,
) {
  const byTable = new Map<string, RateContext[]>();
  for (const ctx of contexts) byTable.set(ctx.taxTableId, [...(byTable.get(ctx.taxTableId) ?? []), ctx]);
  const accumulated = new Map<string, number>();
  for (const ctxs of byTable.values()) {
    for (const rate of [...ctxs[0].rates].sort((a, b) => a.priority - b.priority)) {
      if (rate.rate <= 0) continue;
      const bases = ctxs.map((ctx) => ctx.base + (rate.compounding ? (accumulated.get(ctx.accKey) ?? 0) : 0));
      if (sum(bases) <= 0) continue;
      const rateTax = minorRateOfAmountBankers(sum(bases), rate.rate);
      allocateRateAcrossLines(bases, rateTax).forEach((share, k) => {
        accumulated.set(ctxs[k].accKey, (accumulated.get(ctxs[k].accKey) ?? 0) + share);
        onShare(ctxs[k], rate, share);
      });
      onRate(rate, rateTax);
    }
  }
}

const bucketOf = (rate: MockTaxRate, amount: number): MockTaxBucket => ({
  id: rate.id,
  name: rate.name,
  percentage: rate.rate,
  amount,
  taxTableId: rate.taxTableId,
  taxTableName: rate.taxTableName,
});

function addToBuckets(buckets: MockTaxBucket[], rate: MockTaxRate, amount: number) {
  const bucket = buckets.find((b) => b.id === rate.id);
  if (bucket) bucket.amount += amount;
  else buckets.push(bucketOf(rate, amount));
}

/** PASS 4 (tax.ts:782-848): cart fees — percent on the post-discount subtotal; taxed fees of one table share each rate's rounding. */
function cartFeeMath(
  cart: ActiveCart,
  tax: MockTaxDetails,
  subtotalAfterDiscount: number,
  totalTaxes: MockTaxBucket[],
) {
  const fees = (cart.customFee ?? []).map((fee) => ({
    amount: fee.isPercent ? minorRateOfAmount(subtotalAfterDiscount, fee.amount) : Math.round(fee.amount),
    feeTax: 0,
  }));
  const contexts = (cart.customFee ?? []).flatMap((fee, i): RateContext[] => {
    const tableId = fee.taxTableId || Object.keys(tax.tables)[0];
    const rates = tableId ? (tax.tables[tableId] ?? []) : [];
    if (!fee.applyTaxes || !rates.length) return [];
    const base = tax.taxIncl
      ? inclusiveGrossToNetMinor(fees[i].amount, buildInclusiveMultiplierScaled(rates))
      : fees[i].amount;
    return base > 0 ? [{ lineId: String(i), accKey: String(i), base, taxTableId: tableId, rates }] : [];
  });
  applyRates(
    contexts,
    (ctx, rate, share) => {
      fees[Number(ctx.lineId)].feeTax += share;
      addToBuckets(totalTaxes, rate, share);
    },
    () => undefined,
  );
  return fees;
}

/** The mock's `calculateCartTax`: same order of passes, same rounding, same totals rule (tax.ts:1032-1049). */
export function calculateMockCartTax(
  cart: ActiveCart,
  tax: MockTaxDetails,
  productLines: ActiveProduct[],
): MockCartMath {
  const lines = buildLines(cart, productLines);
  const subtotal = sum(lines.map((l) => l.math.lineDisplayWithFee));
  const discountAmount = allocateCartDiscount(cart, lines, subtotal);
  const byId: Record<string, MockLineMath> = Object.fromEntries(lines.map((l) => [l.id, l.math]));

  const totalTaxes: MockTaxBucket[] = [];
  const contexts = [
    ...lines.filter((l) => l.product).flatMap((l) => productRateContexts(l, tax)),
    ...saleRateContexts(cart, byId, tax),
  ];
  applyRates(
    contexts,
    (ctx, rate, share) => {
      addToBuckets(byId[ctx.lineId].taxes, rate, share);
      // tax.ts:675-688 — a modifier row keeps its own share, one bucket per rate.
      const row = ctx.modifierIndex === undefined ? undefined : byId[ctx.lineId].modifiers[ctx.modifierIndex];
      if (row) {
        row.tax += share;
        row.taxes.push({ ...bucketOf(rate, share), compounding: rate.compounding, priority: rate.priority });
      }
    },
    (rate, rateTax) => addToBuckets(totalTaxes, rate, rateTax),
  );
  for (const m of Object.values(byId)) {
    m.tax = sum(m.taxes.map((t) => t.amount));
    m.total = tax.taxIncl ? m.lineAfterCartDiscount : m.lineAfterCartDiscount + m.tax;
  }
  const cartFees = cartFeeMath(cart, tax, subtotal - discountAmount, totalTaxes);
  const lineMath = Object.values(byId);
  return {
    subtotal,
    discountAmount,
    totalDiscount: sum(lines.map((l) => l.productDiscount)) + discountAmount,
    tax: sum(lineMath.map((m) => m.tax)) + sum(cartFees.map((f) => f.feeTax)),
    total: Math.max(
      0,
      sum(lineMath.map((m) => m.total)) + sum(cartFees.map((f) => f.amount + (tax.taxIncl ? 0 : f.feeTax))),
    ),
    totalTaxes,
    lines: byId,
    cartFees,
  };
}
