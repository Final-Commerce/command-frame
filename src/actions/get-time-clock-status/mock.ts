import { GetTimeClockStatus, GetTimeClockStatusResponse } from './types';

/** Fixed shift start used by the mock — a clocked-in snapshot with no break taken. */
const MOCK_CLOCK_IN_TIME = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

export const mockGetTimeClockStatus: GetTimeClockStatus = async (
  params?: Record<string, never>,
): Promise<GetTimeClockStatusResponse> => {
  console.log('[Mock] getTimeClockStatus called', params);

  const workedMs = Date.now() - new Date(MOCK_CLOCK_IN_TIME).getTime();

  return {
    success: true,
    timestamp: new Date().toISOString(),
    status: 'clocked-in',
    entry: {
      clockInTime: MOCK_CLOCK_IN_TIME,
      breakStartedAt: null,
      totalBreakMinutes: 0,
      workedMs,
    },
  };
};
