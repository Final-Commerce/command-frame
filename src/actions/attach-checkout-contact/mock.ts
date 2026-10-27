import type { AttachCheckoutContact, AttachCheckoutContactParams, AttachCheckoutContactResponse } from './types';

/**
 * Standalone mock of attaching contact to an online order.
 *
 * It mirrors the one REFUSAL the real command makes — a missing email — because
 * that is the mistake a builder actually hits, and a mock that accepted anything
 * would let a checkout screen look finished and lose receipts on the published
 * site.
 *
 * It does NOT mirror "no order to attach to". The real command answers
 * `attached: false` there rather than throwing, precisely so a flow can call it
 * optimistically and still let the shopper pay; the mock always has a checkout
 * to attach to, so it reports `true`.
 */
export const mockAttachCheckoutContact: AttachCheckoutContact = async (
  params: AttachCheckoutContactParams,
): Promise<AttachCheckoutContactResponse> => {
  console.log('[Mock] attachCheckoutContact called', params);

  if (!params) throw new Error('Params required');
  if (!params.email || !params.email.trim()) {
    throw new Error('attachCheckoutContact: email is required — it is where the receipt goes');
  }

  return { attached: true, timestamp: new Date().toISOString() };
};
