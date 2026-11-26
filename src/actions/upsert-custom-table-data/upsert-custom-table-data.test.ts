import { describe, expect, it, vi } from 'vitest';
import { mockUpsertCustomTableData } from './mock';
import { mockGetCustomTableData } from '../get-custom-table-data/mock';

// A row the flow writes is the row it reads next, as on the host (kaching customTables.ts:99-271).
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const read = async (query?: object, page: { offset?: number; limit?: number } = {}) =>
  (await mockGetCustomTableData({ tableName: 'staff-log', query, ...page })).data;

describe('custom-table rows are kept', () => {
  it('an inserted row is read back; an upsert with its _id updates it and keeps createdAt', async () => {
    expect(await read()).toEqual([]);
    const { data: row } = await mockUpsertCustomTableData({
      tableName: 'staff-log',
      data: { userId: 'u1', event: 'in', createdAt: 'ignored' },
    });
    expect(row).toMatchObject({ userId: 'u1', event: 'in', _id: expect.any(String) });
    expect(row.createdAt).not.toBe('ignored');
    expect(await read()).toEqual([row]);

    const { data: updated } = await mockUpsertCustomTableData({
      tableName: 'staff-log',
      data: { _id: row._id, event: 'out' },
    });
    expect(updated).toMatchObject({ _id: row._id, userId: 'u1', event: 'out', createdAt: row.createdAt });
    expect(await read()).toEqual([updated]);
  });

  it('filters by field equality, pages with offset/limit, refuses query operators, needs a tableName', async () => {
    await mockUpsertCustomTableData({ tableName: 'staff-log', data: { userId: 'u2', event: 'in' } });
    await mockUpsertCustomTableData({ tableName: 'staff-log', data: { userId: 'u2', event: 'out' } });
    expect((await read({ userId: 'u2' })).map((r) => r.event)).toEqual(['in', 'out']);
    expect((await read({ userId: 'u2' }, { offset: 1, limit: 1 })).map((r) => r.event)).toEqual(['out']);
    await expect(read({ createdAt: { $gte: '2020' } })).rejects.toThrow(
      'The mock filters custom-table rows by plain field equality only; "createdAt" is not modelled',
    );
    await expect(mockGetCustomTableData({ tableName: '' })).rejects.toThrow('tableName is required');
    await expect(mockUpsertCustomTableData({ tableName: '', data: {} })).rejects.toThrow('tableName is required');
  });
});
