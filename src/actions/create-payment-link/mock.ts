import { CreatePaymentLink, CreatePaymentLinkParams, CreatePaymentLinkResponse } from './types';
import { MOCK_CART, mockPublishEvent, resetMockCart } from '../../demo/database';

export const mockCreatePaymentLink: CreatePaymentLink = async (
  params: CreatePaymentLinkParams,
): Promise<CreatePaymentLinkResponse> => {
  console.log('[Mock] createPaymentLink called', params);

  if (!params) throw new Error('Params required');
  const email = params.email?.trim() ? params.email : undefined;
  const phone = params.phone?.trim() ? params.phone : undefined;
  if (email && phone) {
    throw new Error('exactly one of email or phone delivers a payment link, not both');
  }
  if (!email && !phone) {
    throw new Error('exactly one of email or phone is required to deliver the payment link');
  }

  const hasCart =
    MOCK_CART.products.length > 0 ||
    (MOCK_CART.customSales?.length ?? 0) > 0 ||
    (MOCK_CART.nonRevenueItems?.length ?? 0) > 0;
  if (!hasCart || MOCK_CART.total <= 0) {
    throw new Error('ring the sale up before creating a payment link: the cart is empty');
  }

  const mockOrderId = 'order_' + Date.now();
  const mockLinkId = 'link_' + Math.random().toString(36).substr(2, 9);

  // Marks the cart consumed, same as a successful send in kaching — the order
  // now owns the line.
  resetMockCart();
  mockPublishEvent('cart', 'cart-created', {});

  return {
    success: true,
    timestamp: new Date().toISOString(),
    orderId: mockOrderId,
    url: `https://mock.finalpos.dev/pay/${mockLinkId}`,
    id: mockLinkId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    delivery: email ? { email: 'sent' } : { sms: 'sent' },
  };
};
