import type { SetScheduledFor, SetScheduledForParams, SetScheduledForResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';

/** Time for the demo's live cart, which has no order until it is paid or parked. */
let mockCartScheduledFor: string | null = null;

/**
 * An ISO 8601 date-time WITH a zone — 'Z' or an offset. A zoneless time ('2026-10-13T19:00') is
 * refused: it would mean a different moment on every device. Date.parse alone is too lenient
 * (it accepts strings like "tomorrow at 7"), so the shape is checked first.
 */
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?(Z|[+-]\d{2}:?\d{2})$/;

/** The YYYY-MM-DD part is a real day — Date.parse quietly rolls "Feb 30" over to March 2. */
const isCalendarDate = (text: string): boolean => {
  const [y, m, d] = text.slice(0, 10).split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  return day.getUTCFullYear() === y && day.getUTCMonth() === m - 1 && day.getUTCDate() === d;
};

/** ISO 8601 in, UTC ISO 8601 out; null stays null (as soon as possible). */
export const normalizeScheduledFor = (value: unknown): string | null => {
  if (value === null) return null;
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('setScheduledFor: scheduledFor must be an ISO 8601 date-time or null');
  }
  const text = value.trim();
  const ms = ISO_DATE_TIME.test(text) && isCalendarDate(text) ? Date.parse(text) : NaN;
  if (Number.isNaN(ms)) {
    throw new Error(`setScheduledFor: "${value}" is not an ISO 8601 date-time with Z or an offset`);
  }
  return new Date(ms).toISOString();
};

export const mockSetScheduledFor: SetScheduledFor = async (
  params: SetScheduledForParams,
): Promise<SetScheduledForResponse> => {
  console.log('[Mock] setScheduledFor called', params);

  const scheduledFor = normalizeScheduledFor(params?.scheduledFor);
  const timestamp = new Date().toISOString();

  if (!params.orderId) {
    mockCartScheduledFor = scheduledFor;
    return { success: true, orderId: null, scheduledFor: mockCartScheduledFor, timestamp };
  }

  const order = [...MOCK_ORDERS, ...MOCK_PARKED_ORDERS].find((o) => o._id === params.orderId);
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  order.scheduledFor = scheduledFor;
  mockPublishEvent('orders', 'order-updated', { order });

  return { success: true, orderId: order._id!, scheduledFor, timestamp };
};
