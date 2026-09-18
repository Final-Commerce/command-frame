import { StartCheckout, StartCheckoutParams, StartCheckoutResponse } from './types';
import { MOCK_CART, MOCK_COMPANY, mockPublishEvent } from '../../demo/database';

/**
 * Standalone mock of the storefront checkout.
 *
 * It mirrors the REFUSALS of the real command (empty cart, missing email,
 * container not on the page) in the same order, because those are what a
 * builder actually hits first — a mock that accepted anything would let a
 * checkout screen look finished and fail on the published site.
 *
 * The mounted box is deliberately labelled as a mock. The real command mounts
 * the provider's hosted card fields (iframes owned by the payment provider);
 * nothing here takes a card number, and the placeholder must never look like
 * it does. Its button publishes `payment-completed` so a flow's subscriber —
 * the only way the outcome ever arrives — can be exercised in preview.
 */
export const mockStartCheckout: StartCheckout = async (
  params: StartCheckoutParams,
): Promise<StartCheckoutResponse> => {
  console.log('[Mock] startCheckout called', params);

  if (!params) throw new Error('Params required');
  if (!params.contact?.email || !params.contact.email.trim()) {
    throw new Error('startCheckout: contact.email is required — it is where the receipt goes');
  }
  if (!params.container || typeof params.container !== 'string') {
    throw new Error(
      'startCheckout: container must be a CSS selector string (e.g. "#card-fields") — a DOM element cannot cross the command boundary',
    );
  }

  const lineCount = (MOCK_CART.products?.length ?? 0) + (MOCK_CART.customSales?.length ?? 0);
  if (!lineCount) {
    throw new Error('startCheckout: cannot check out an empty cart');
  }

  // Resolved BEFORE the order is "created", exactly as the real command does:
  // finding out the selector is wrong after an order exists would leave an
  // unpaid order behind for a typo that cost nothing to catch first.
  const container = typeof document === 'undefined' ? null : document.querySelector(params.container);
  if (!container) {
    throw new Error(`startCheckout: checkout container "${params.container}" was not found on the page`);
  }

  const serverTotal = Math.round(MOCK_CART.amountToBeCharged || MOCK_CART.total);
  const currency = (MOCK_COMPANY.settings as { currency?: string } | undefined)?.currency ?? 'USD';
  const suffix = String(Date.now()).slice(-6);
  const order = {
    orderId: `mock-order-${suffix}`,
    receiptId: `ON-001-${suffix}`,
    serverTotal,
    currency,
    paymentStatus: 'ready' as const,
    orderPassword: `mock-pw-${suffix}`,
  };

  mockPublishEvent('checkout', 'checkout-started', { ...order });

  container.replaceChildren();
  const box = document.createElement('div');
  box.setAttribute('data-mock-checkout', 'true');
  box.style.cssText =
    'border:1px dashed #9aa;border-radius:8px;padding:16px;font:14px system-ui,sans-serif;text-align:center;color:#334';
  const label = document.createElement('div');
  label.textContent = 'Mock payment fields — the published site shows the real hosted card fields here.';
  label.style.cssText = 'margin-bottom:12px;opacity:.75';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = `Simulate paying ${(serverTotal / 100).toFixed(2)} ${currency}`;
  button.style.cssText =
    'padding:10px 16px;border:0;border-radius:6px;background:#111;color:#fff;font-size:14px;cursor:pointer';
  button.addEventListener('click', () => {
    button.disabled = true;
    // `Authorised` is what the real provider reports for a successful card
    // entry. It is NOT settlement — see the checkout topic docs.
    mockPublishEvent('checkout', 'payment-completed', {
      orderId: order.orderId,
      receiptId: order.receiptId,
      resultCode: 'Authorised',
    });
  });
  box.appendChild(label);
  box.appendChild(button);
  container.appendChild(box);

  return {
    success: true,
    timestamp: new Date().toISOString(),
    order,
  };
};
