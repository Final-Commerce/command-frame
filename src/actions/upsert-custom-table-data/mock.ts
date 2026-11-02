import { UpsertCustomTableData, UpsertCustomTableDataParams, UpsertCustomTableDataResponse } from './types';
import { MOCK_CUSTOM_TABLE_DATA } from '../../demo/mocks/custom-tables';
import { assertMockCustomTableWriteNotDeclined, mockPublishEvent } from '../../demo/database';
import { generateMongoID } from '@final-commerce/common';

/**
 * The host's upsert (kaching upsert-custom-table-data/handler.ts, customTables.ts:120-271): an `_id` of an existing row
 * updates it, anything else inserts (a given `_id` kept as-is); `createdAt`/`updatedAt` are the host's; the row is
 * stored, so getCustomTableData reads it back. Not modelled: the table's field schema — the host drops keys that are
 * not fields of the table and refuses an unknown table; the mock stores every key.
 */
export const mockUpsertCustomTableData: UpsertCustomTableData = async <T = any>(
  params?: UpsertCustomTableDataParams<T>,
): Promise<UpsertCustomTableDataResponse<T>> => {
  console.log('[Mock] upsertCustomTableData called', params);
  if (!params?.tableName) throw new Error('tableName is required');
  assertMockCustomTableWriteNotDeclined(params.tableName);

  const { _id: givenId, ...fields } = (params.data ?? {}) as Record<string, unknown>;
  delete fields.createdAt;
  delete fields.updatedAt;
  const rows = (MOCK_CUSTOM_TABLE_DATA[params.tableName] ??= []);
  const now = new Date().toISOString();
  const existing = typeof givenId === 'string' ? rows.find((row) => row._id === givenId) : undefined;
  const row = existing
    ? Object.assign(existing, fields, { updatedAt: now })
    : { _id: typeof givenId === 'string' ? givenId : generateMongoID(), ...fields, createdAt: now, updatedAt: now };
  if (!existing) rows.push(row);

  mockPublishEvent('custom-tables', existing ? 'row-updated' : 'row-created', { tableName: params.tableName, ...row });
  return {
    success: true,
    data: { ...row } as UpsertCustomTableDataResponse<T>['data'],
    timestamp: now,
  };
};
