import { describe, it, expect, vi } from 'vitest';
import { setScheduledFor } from './action';
import { mockSetScheduledFor, normalizeScheduledFor } from './mock';
import { mockGetOrders } from '../get-orders/mock';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;
const ids = async (params: Parameters<typeof mockGetOrders>[0]) =>
  (await mockGetOrders(params)).orders.map((o) => o._id);

describe('setScheduledFor action', () => {
  it('calls commandFrameClient with setScheduledFor and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await setScheduledFor({ orderId: 'o1', scheduledFor: '2026-10-13T23:00:00.000Z' });

    expect(mockCall).toHaveBeenCalledWith('setScheduledFor', {
      orderId: 'o1',
      scheduledFor: '2026-10-13T23:00:00.000Z',
    });
  });
});

describe('normalizeScheduledFor', () => {
  it('normalises an ISO date-time (with an offset) to UTC, and keeps null', () => {
    expect(normalizeScheduledFor('2026-10-13T19:00:00-04:00')).toBe('2026-10-13T23:00:00.000Z');
    expect(normalizeScheduledFor(null)).toBeNull();
  });

  it('rejects empty, non-string and unparseable values', () => {
    expect(() => normalizeScheduledFor('  ')).toThrow('ISO 8601 date-time or null');
    expect(() => normalizeScheduledFor(1760396400000)).toThrow('ISO 8601 date-time or null');
    expect(() => normalizeScheduledFor('tomorrow at 7')).toThrow('not an ISO 8601 date-time');
    // No zone: it would mean a different moment on every device.
    expect(() => normalizeScheduledFor('2026-10-13T19:00:00')).toThrow('with Z or an offset');
    expect(() => normalizeScheduledFor('2026-02-30T19:00:00Z')).toThrow('not an ISO 8601 date-time');
  });
});

describe('setScheduledFor mock', () => {
  it('schedules orders, filters and sorts by the time, then clears it', async () => {
    await mockSetScheduledFor({ orderId: 'order_1004', scheduledFor: '2026-10-13T23:00:00.000Z' });
    await mockSetScheduledFor({ orderId: 'order_1003', scheduledFor: '2026-10-13T21:30:00.000Z' });

    expect(await ids({ scheduled: true, sortBy: 'scheduledFor', sortDirection: 'ascending' })).toEqual([
      'order_1003',
      'order_1004',
    ]);
    expect(await ids({ scheduledFrom: '2026-10-13T22:00:00Z' })).toEqual(['order_1004']);
    expect(await ids({ scheduledTo: '2026-10-13T22:00:00Z' })).toEqual(['order_1003']);
    expect(await ids({ scheduled: false })).not.toContain('order_1004');

    await mockSetScheduledFor({ orderId: 'order_1004', scheduledFor: null });
    await mockSetScheduledFor({ orderId: 'order_1003', scheduledFor: null });
    expect(await ids({ scheduled: true })).toEqual([]);
  });

  it('keeps a time on the live cart when no order is given', async () => {
    const response = await mockSetScheduledFor({ scheduledFor: '2026-10-13T23:00:00Z' });
    expect(response).toMatchObject({ orderId: null, scheduledFor: '2026-10-13T23:00:00.000Z' });
  });

  it('throws for an unknown order', async () => {
    await expect(mockSetScheduledFor({ orderId: 'nope', scheduledFor: null })).rejects.toThrow(
      'Order with ID nope not found',
    );
  });
});
