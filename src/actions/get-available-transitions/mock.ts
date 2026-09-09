import type { GetAvailableTransitions } from './types';

/**
 * Mock implementation: returns a fixed set of plausible transitions
 * so the demo app has data to render. Mirrors an UNPAID order under the
 * default (empty cross-axis rules) config.
 *
 * FULFILLMENT-AXIS ONLY (common 2.1.4 contract): the payment axis never
 * appears as an available transition — it moves exclusively through the
 * money operations (pay / refund / void), which derive their own landing
 * pairs. Every row keeps `to.payment` equal to the order's current payment
 * state, exactly like the host's `getAvailableTransitions`.
 */
export const getAvailableTransitionsMock: GetAvailableTransitions = () =>
  Promise.resolve({
    transitions: [
      {
        to: { payment: 'unpaid', fulfillment: 'in_progress' },
        displayLabel: 'Start Preparing',
        conditions: [{ met: true, description: 'Order has items' }],
      },
      {
        to: { payment: 'unpaid', fulfillment: 'fulfilled' },
        displayLabel: 'Mark Fulfilled',
        conditions: [{ met: true, description: 'Order has items' }],
      },
      {
        to: { payment: 'unpaid', fulfillment: 'on_hold' },
        displayLabel: 'Park Order',
        conditions: [{ met: true, description: 'Order is open' }],
      },
      {
        to: { payment: 'unpaid', fulfillment: 'cancelled' },
        displayLabel: 'Cancel Order',
        conditions: [
          { met: true, description: 'Order exists' },
          { met: false, description: 'No payments captured (mock: skipped)' },
        ],
      },
    ],
  });
