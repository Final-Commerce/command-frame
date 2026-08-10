/**
 * Order Voided Event Types
 */

export interface OrderVoidedPayload {
  orderId: string;
  /** 'voided' = nothing captured; 'refunded' = captured legs were refunded. */
  outcome: 'voided' | 'refunded';
  reason?: string;
}
