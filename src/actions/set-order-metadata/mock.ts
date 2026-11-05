import type { CFMetadataItem } from '../../CommonTypes';
import type { SetOrderMetadata, SetOrderMetadataParams, SetOrderMetadataResponse } from './types';
import { MOCK_ORDERS, MOCK_PARKED_ORDERS, mockPublishEvent } from '../../demo/database';

/** Metadata for the demo's live cart, which has no order until it is paid or parked. */
let mockCartMetadata: CFMetadataItem[] = [];

/** Set/remove keys; untouched items (and extra fields such as `externalId`) are kept as-is. */
export const mergeMetadata = <T extends CFMetadataItem>(
  current: T[] | undefined,
  changes: Record<string, string | null>,
): T[] => {
  const byKey = new Map((current ?? []).map((m) => [m.key, m]));
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) byKey.delete(key);
    else byKey.set(key, { ...byKey.get(key), key, value } as T);
  }
  return [...byKey.values()];
};

export const mockSetOrderMetadata: SetOrderMetadata = async (
  params: SetOrderMetadataParams,
): Promise<SetOrderMetadataResponse> => {
  console.log('[Mock] setOrderMetadata called', params);

  if (!params?.metadata || Object.keys(params.metadata).length === 0) {
    throw new Error('setOrderMetadata: metadata must set or remove at least one key');
  }
  for (const [key, value] of Object.entries(params.metadata)) {
    if (!key.trim()) throw new Error('setOrderMetadata: metadata keys must be non-empty');
    if (value !== null && typeof value !== 'string') {
      throw new Error(`setOrderMetadata: value for "${key}" must be a string or null`);
    }
  }

  if (!params.orderId) {
    mockCartMetadata = mergeMetadata(mockCartMetadata, params.metadata);
    return { success: true, orderId: null, metadata: mockCartMetadata, timestamp: new Date().toISOString() };
  }

  const order = [...MOCK_ORDERS, ...MOCK_PARKED_ORDERS].find((o) => o._id === params.orderId);
  if (!order) {
    throw new Error(`Order with ID ${params.orderId} not found`);
  }

  order.metadata = mergeMetadata(order.metadata, params.metadata);
  mockPublishEvent('orders', 'order-updated', { order });

  return { success: true, orderId: order._id!, metadata: order.metadata, timestamp: new Date().toISOString() };
};
