# getTimeClockStatus

Returns the active employee's current time-clock state: clocked out, clocked
in, or on break, and since when.

**This command is READ-ONLY by design.** There are no `clockIn` / `clockOut`
/ `startBreak` / `endBreak` commands in this library; time clock actions
themselves are not part of this contract. Use this to read the current state
for display (a badge, a shift timer, a break banner).

## Parameters

None. Call with no arguments, or an empty object.

## Response

`Promise<GetTimeClockStatusResponse>`

| Field       | Type                                  | Description                                           |
| :---------- | :------------------------------------ | :---------------------------------------------------- |
| `success`   | `boolean`                             | Always `true`.                                        |
| `timestamp` | `string`                              | ISO date string, when this response was generated.    |
| `status`    | `'out' \| 'clocked-in' \| 'on-break'` | The active employee's current time-clock state.       |
| `entry`     | `TimeClockEntry \| null`              | `null` when `status` is `'out'`. See below otherwise. |

### `TimeClockEntry`

```typescript
interface TimeClockEntry {
  clockInTime: string; // ISO date string, when the current shift started.
  breakStartedAt: string | null; // ISO date string, or null when not currently on break.
  totalBreakMinutes: number; // Total break time accumulated on this shift so far.
  workedMs: number; // Milliseconds worked so far, AS OF this response.
}
```

`workedMs` is a **snapshot at call time**, not a live value. It does not
update on its own after the response is returned.

## Example Usage

```typescript
import { command } from '@final-commerce/command-frame';

const { status, entry } = await command.getTimeClockStatus();

if (status === 'out') {
  console.log('Not clocked in.');
} else {
  console.log(`${status} since ${entry.clockInTime}, worked ${entry.workedMs}ms so far.`);
}
```

### Ticking the shift timer client-side

`workedMs` is a point-in-time read, not a subscription. A flow that shows a
running shift clock should compute the delta itself from `clockInTime` and
tick locally, rather than re-polling this command on an interval:

```typescript
const { entry } = await command.getTimeClockStatus();

if (entry) {
  const clockInMs = new Date(entry.clockInTime).getTime();
  setInterval(() => {
    const elapsed = Date.now() - clockInMs;
    renderShiftTimer(elapsed);
  }, 1000);
}
```

## Error Handling

This command does not throw under normal use. `status: 'out'` (with
`entry: null`) is the correct, non-error response when no shift is open; it
is not treated as a failure.

## Notes

- Read-only by design: there is no way to clock in, clock out, start a break,
  or end a break through this library.
- `entry` is `null` exactly when `status` is `'out'`; check `status`, not
  `entry`'s presence, when branching on state.
- `totalBreakMinutes` accumulates across every break taken on the current
  shift, not just the current break.
