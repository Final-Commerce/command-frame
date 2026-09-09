// Get Time Clock Status Types
//
// READ-ONLY query: is the active employee clocked out, clocked in, or on
// break, and since when? There are no clock-in/clock-out commands — this
// action only reports the current state; `workedMs` is a snapshot at call
// time and flows are expected to tick it client-side from `clockInTime`.

export interface TimeClockEntry {
  /** ISO date string of when the current shift started. */
  clockInTime: string;
  /** ISO date string of when the current break started, or `null` when not on break. */
  breakStartedAt: string | null;
  /** Total break time accumulated on this shift so far, in minutes. */
  totalBreakMinutes: number;
  /** Milliseconds worked so far on this shift, as of when this response was generated. */
  workedMs: number;
}

export interface GetTimeClockStatusResponse {
  success: boolean;
  timestamp: string;
  status: 'out' | 'clocked-in' | 'on-break';
  /** `null` when `status` is `'out'`. */
  entry: TimeClockEntry | null;
}

export type GetTimeClockStatus = (params?: Record<string, never>) => Promise<GetTimeClockStatusResponse>;
