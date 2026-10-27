import { ResumeCheckout, ResumeCheckoutParams, ResumeCheckoutResponse } from './types';
import { mockPublishEvent } from '../../demo/database';

/**
 * Standalone mock of the checkout return leg.
 *
 * It reads the SAME query parameters the real provider sends a shopper back
 * with, so a builder can exercise the redirect path in preview by appending
 * them by hand:
 *
 *   ?sessionId=CS_MOCK&redirectResult=MOCK
 *
 * Without them it answers `{ resumed: false }` and does nothing, which is what
 * the real command does on an ordinary page load. That is the branch a
 * checkout screen hits on every normal visit, so it is the one worth getting
 * right in a mock.
 */
export const mockResumeCheckout: ResumeCheckout = async (
  params?: ResumeCheckoutParams,
): Promise<ResumeCheckoutResponse> => {
  console.log('[Mock] resumeCheckout called', params);

  const href = params?.url ?? (typeof window === 'undefined' ? '' : window.location.href);
  let redirectResult: string | null = null;
  try {
    redirectResult = new URL(href).searchParams.get('redirectResult');
  } catch {
    redirectResult = null;
  }

  if (!redirectResult) {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      checkout: { resumed: false },
    };
  }

  const suffix = String(Date.now()).slice(-6);
  const checkout = {
    resumed: true,
    orderId: `mock-order-${suffix}`,
    receiptId: `ON-001-${suffix}`,
    // `Authorised` is what the real provider reports for a completed redirect.
    // It is NOT settlement — see the checkout topic docs.
    resultCode: 'Authorised',
    sessionResult: `mock-session-result-${suffix}`,
    orderPassword: `mock-pw-${suffix}`,
  };

  mockPublishEvent('checkout', 'payment-completed', {
    orderId: checkout.orderId,
    receiptId: checkout.receiptId,
    resultCode: checkout.resultCode,
    sessionResult: checkout.sessionResult,
  });

  return { success: true, timestamp: new Date().toISOString(), checkout };
};
