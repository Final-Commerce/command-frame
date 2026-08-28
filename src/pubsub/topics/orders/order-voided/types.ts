import type { TopicEvent } from '../../../types';

/**
 * Order Voided Event Types
 */

export interface OrderVoidedPayload {
  orderId: string;
  /** 'voided' = nothing captured; 'refunded' = captured legs were refunded. */
  outcome: 'voided' | 'refunded';
  reason?: string;
}

/**
 * Typed event for order-voided
 */
export type OrderVoidedEvent = TopicEvent<OrderVoidedPayload>;
