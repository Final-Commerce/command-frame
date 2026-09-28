// Get Remaining Refundable Quantities Types
export interface GetRemainingRefundableQuantitiesParams {
  orderId?: string;
}

export interface GetRemainingRefundableQuantitiesResponse {
  success: boolean;
  lineItems: Record<string, number>; // itemKey: remaining qty
  customSales: Record<string, number>; // customSaleId: remaining qty
  /**
   * Remaining refundable cart fees, keyed by `order.cartFees[].id` —
   * the same key `processPartialRefund` takes for `type: 'fee'` items.
   * 0/1 semantics: `1` = still refundable, `0` = already refunded.
   */
  cartFees: Record<string, number>;
  /**
   * Remaining refundable tips, keyed by the paying method's
   * `transactionId` — the same key `processPartialRefund` takes for
   * `type: 'tip'` items. Only payment methods that carry a tip appear.
   * 0/1 semantics: `1` = still refundable, `0` = already refunded.
   */
  tips: Record<string, number>;
  /**
   * Remaining refundable bookings, keyed by `order.reservations[].internalId` —
   * the same key `processPartialRefund` takes for `type: 'reservation'` items.
   * A service is sold as a reservation rather than a line item, so without this
   * map a refund screen can show everything on the order EXCEPT the appointment.
   * 0/1 semantics: `1` = still refundable, `0` = already refunded.
   */
  reservations: Record<string, number>;
  timestamp: string;
}

export type GetRemainingRefundableQuantities = (
  params?: GetRemainingRefundableQuantitiesParams,
) => Promise<GetRemainingRefundableQuantitiesResponse>;
