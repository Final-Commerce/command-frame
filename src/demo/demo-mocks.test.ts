/* Mock-mode fidelity: demo tax layer, split-payment ledger, refund seeds, mongo-lite queries. */
import { describe, it, expect, vi, beforeAll } from "vitest";
import { RENDER_MOCKS } from "../projects/render/mocks";
import { MOCK_CART, MOCK_ORDER_3, MOCK_ORDERS, MOCK_PRODUCTS, mockSubscribeToTopic, resetMockCart, MOCK_TAX_RATE } from "./database";

// Re-read MOCK_CART through the module (it's an `export let` that resetMockCart reassigns).
import * as db from "./database";
const cart = () => db.MOCK_CART;

beforeAll(() => {
    vi.stubGlobal("window", { alert: () => undefined, prompt: () => null });
});

describe("seed backfill", () => {
    it("stamps tax onto seeded orders, lines, payments and refund events", () => {
        expect(MOCK_ORDER_3.summary.totalTaxes).toBe(200);
        expect(MOCK_ORDER_3.summary.subTotal).toBe(2000);
        expect(MOCK_ORDER_3.summary.total).toBe(2200);
        expect(MOCK_ORDER_3.paymentMethods[0].amount).toBe(2200);
        expect(MOCK_ORDER_3.lineItems[0].totalTax).toBe(200);
        const refunds = MOCK_ORDER_3.refund ?? [];
        expect(refunds).toHaveLength(2);
        const refundedTotal = refunds.reduce((s, r) => s + (r.summary?.total ?? 0), 0);
        expect(refundedTotal).toBe(2200); // reconciles with the taxed order total
        expect(refunds[0].refundPayment[0].amount).toBe(1100);
        expect(refunds[0].lineItems[0].totalTax).toBe(100);
        // Refund lines must not share taxes arrays with the order line.
        expect(refunds[0].lineItems[0].taxes).not.toBe(MOCK_ORDER_3.lineItems[0].taxes);
        // Other seeds taxed too.
        for (const o of MOCK_ORDERS) expect(o.summary.totalTaxes).toBeGreaterThan(0);
    });
});

describe("mongo-lite queries", () => {
    it("honors $or/$regex on getProducts", async () => {
        const res = await RENDER_MOCKS.getProducts({
            query: { $or: [{ name: { $regex: "beet", $options: "i" } }, { sku: { $regex: "^nope$" } }] }
        });
        expect(res.total).toBe(1);
        expect(res.products[0].name).toMatch(/Beet/);
    });

    it("matches categories by array inclusion and $in", async () => {
        const vegan = await RENDER_MOCKS.getProducts({ query: { categories: "cat_vegan" } });
        const veganIn = await RENDER_MOCKS.getProducts({ query: { categories: { $in: ["cat_vegan"] } } });
        expect(vegan.total).toBeGreaterThan(0);
        expect(vegan.total).toBe(veganIn.total);
    });

    it("filters and paginates getCustomers", async () => {
        const all = await RENDER_MOCKS.getCustomers({});
        const page = await RENDER_MOCKS.getCustomers({ offset: 1, limit: 2 });
        expect(page.customers).toHaveLength(2);
        expect(page.total).toBe(all.total);
        const byId = await RENDER_MOCKS.getCustomers({ query: { _id: all.customers[0]._id } });
        expect(byId.total).toBe(1);
    });
});

describe("cart tax + split payments", () => {
    it("taxes the cart, publishes split-payments, and stamps the completed order", async () => {
        resetMockCart();
        const events: Array<{ data: { splitPayment: { payments?: unknown[]; paidAmount?: number } | null } }> = [];
        mockSubscribeToTopic("split-payments", e => events.push(e));

        await RENDER_MOCKS.addProductToCart({});
        const price = Number(MOCK_PRODUCTS[0].variants[0].price);
        const tax = Math.round(price * MOCK_TAX_RATE);
        expect(cart().tax).toBe(tax);
        expect(cart().total).toBe(price + tax);
        expect(cart().taxes?.[0]?.amount).toBe(tax);
        expect(cart().amountToBeCharged).toBe(price + tax);

        // Arm a partial tender for less than the total, then take it in cash.
        const partialMinor = 100; // $1.00
        await RENDER_MOCKS.partialPayment({ amount: partialMinor / 100, isPercent: false, openUI: false });
        expect(cart().amountToBeCharged).toBe(partialMinor);
        const firstTender = await RENDER_MOCKS.cashPayment({ openChangeCalculator: false });
        expect(firstTender.order).toBeNull();

        const inProgress = events.at(-1)!.data.splitPayment;
        expect(inProgress?.payments).toHaveLength(1);
        expect(inProgress?.paidAmount).toBe(partialMinor);

        // Pay the rest by card — the order carries the real two-row ledger.
        const done = await RENDER_MOCKS.tapToPayPayment({});
        const order = done.order!;
        expect(order.paymentMethods).toHaveLength(2);
        expect(order.paymentMethods[0].amount).toBe(partialMinor);
        expect(order.paymentMethods[1].amount).toBe(price + tax - partialMinor);
        expect(order.paymentMethods[1].emv).toContain("4242");
        expect(order.summary.total).toBe(price + tax);
        expect(order.summary.subTotal).toBe(price);
        expect(order.summary.totalTaxes).toBe(tax);
        expect(order.lineItems[0].totalTax).toBe(tax);

        // Session ended → cleared slice published.
        expect(events.at(-1)!.data.splitPayment).toBeNull();
        expect(cart().total).toBe(0);
    });

    it("keeps parked orders pretax and re-taxes on resume", async () => {
        resetMockCart();
        await RENDER_MOCKS.addProductToCart({});
        const price = Number(MOCK_PRODUCTS[0].variants[0].price);
        const parked = await RENDER_MOCKS.parkOrder({});
        expect(parked.order.summary.total).toBe(price); // pretax while parked
        expect(parked.order.summary.totalTaxes).toBe(0);

        await RENDER_MOCKS.resumeParkedOrder({ orderId: parked.order._id });
        const tax = Math.round(price * MOCK_TAX_RATE);
        expect(cart().total).toBe(price + tax); // re-taxed on resume
        expect(cart().tax).toBe(tax);
        await RENDER_MOCKS.clearCart({});
        expect(cart().total).toBe(0);
    });

    it("removeProductNote actually clears the note", async () => {
        resetMockCart();
        await RENDER_MOCKS.addProductToCart({});
        const internalId = cart().products[0].internalId;
        await RENDER_MOCKS.addProductNote({ note: "no onions", internalId });
        expect(cart().products[0].note).toBe("no onions");
        await RENDER_MOCKS.removeProductNote({ internalId });
        expect(cart().products[0].note).toBeUndefined();
    });

    it("supports quantity on custom sales at creation and via updateCartItemQuantity", async () => {
        resetMockCart();
        const sale = await RENDER_MOCKS.addCustomSale({ label: "Raffle Ticket", price: 2, quantity: 3 });
        expect(sale.quantity).toBe(3);
        expect(cart().customSales?.[0]?.quantity).toBe(3);
        expect(cart().total).toBe(600); // 200 minor × 3, untaxed

        // Custom sales share the quantity action — customSaleId is the internalId.
        await RENDER_MOCKS.updateCartItemQuantity({ internalId: sale.customSaleId, quantity: 5 });
        expect(cart().customSales?.[0]?.quantity).toBe(5);
        expect(cart().total).toBe(1000);

        // Quantity 0 removes the line.
        await RENDER_MOCKS.updateCartItemQuantity({ internalId: sale.customSaleId, quantity: 0 });
        expect(cart().customSales).toHaveLength(0);
        expect(cart().total).toBe(0);
    });

    it("taxes custom sale lines by price × quantity and rejects invalid quantities", async () => {
        resetMockCart();
        await RENDER_MOCKS.addCustomSale({ label: "Service", price: 10, quantity: 2, applyTaxes: true });
        expect(cart().tax).toBe(Math.round(2000 * MOCK_TAX_RATE));
        expect(cart().total).toBe(2000 + Math.round(2000 * MOCK_TAX_RATE));

        await expect(RENDER_MOCKS.addCustomSale({ label: "Bad", price: 1, quantity: 0 })).rejects.toThrow(/positive integer/);
        await expect(RENDER_MOCKS.addCustomSale({ label: "Bad", price: 1, quantity: 1.5 })).rejects.toThrow(/positive integer/);
    });

    it("excludes untaxed custom sales from the tax base", async () => {
        resetMockCart();
        // addCustomSale takes RAW dollars (the mock converts to minor units).
        await RENDER_MOCKS.addCustomSale({ label: "Tip jar", price: 5, applyTaxes: false });
        expect(cart().tax).toBe(0);
        expect(cart().total).toBe(500);
        await RENDER_MOCKS.addCustomSale({ label: "Service", price: 10, applyTaxes: true });
        expect(cart().tax).toBe(100); // only the taxable line contributes
        expect(cart().total).toBe(1600);
        // Completed order carries both custom sales; only the taxable one is stamped.
        const res = await RENDER_MOCKS.cashPayment({ openChangeCalculator: false });
        const order = res.order!;
        expect(order.customSales).toHaveLength(2);
        const taxed = order.customSales.find(cs => cs.applyTaxes);
        const untaxed = order.customSales.find(cs => !cs.applyTaxes);
        expect(taxed?.totalTax).toBe(100);
        expect(untaxed?.totalTax).toBe(0);
    });
});
