import { describe, it, expect, vi } from 'vitest';
import { openBarcodeScanner } from './action';
import { mockOpenBarcodeScanner } from './mock';
import { RENDER_MOCKS } from '../../projects/render/mocks';
import { command } from '../../index';

vi.mock('../../client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../client')>()),
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('openBarcodeScanner action', () => {
  it('asks the host to open the camera scanner, with no params', async () => {
    mockCall.mockResolvedValue({ success: true, timestamp: '2026-11-19T00:00:00.000Z' });

    const response = await openBarcodeScanner();

    expect(mockCall).toHaveBeenCalledWith('openBarcodeScanner', undefined);
    expect(response).toEqual({ success: true, timestamp: '2026-11-19T00:00:00.000Z' });
  });

  it('passes on the host refusing (no scanner on this device)', async () => {
    mockCall.mockRejectedValue(new Error('UNAVAILABLE'));

    await expect(openBarcodeScanner()).rejects.toThrow('UNAVAILABLE');
  });

  it('is on the public command object', () => {
    expect(command.openBarcodeScanner).toBe(openBarcodeScanner);
  });
});

describe('openBarcodeScanner mock', () => {
  it('opens at once, so a flow previews without a camera', async () => {
    const response = await mockOpenBarcodeScanner();

    expect(response.success).toBe(true);
    expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false);
  });

  it('is the Render mock', () => {
    expect(RENDER_MOCKS.openBarcodeScanner).toBe(mockOpenBarcodeScanner);
  });
});
