# getContext

Retrieves the current environment/context information from the parent application. This includes user, company, device, station, outlet, and build information.

## Parameters

This action takes no parameters.

## Response

### `GetContextResponse`

```typescript
interface GetContextResponse {
    userId: string | null;
    userRoleId: string | null;
    companyId: string | null;
    companyName: string | null;
    deviceId: string | null;
    stationId: string | null;
    stationName: string | null;
    outletId: string | null;
    outletName: string | null;
    buildId: string | null;
    buildName: string | null;
    buildVersion: string | null;
    buildSourceId: string | null;
    buildIsPremium: boolean;
    timestamp: string;
}
```

#### `userId` (string | null)

The ID of the currently logged-in user. Returns `null` if no user is logged in.

#### `companyId` (string | null)

The ID of the currently active company. Returns `null` if no company is active.

#### `companyName` (string | null)

The name of the currently active company. Returns `null` if no company is active.

#### `deviceId` (string | null)

The device ID/serial number from the native app. Returns `null` if not available (e.g., when running in a browser).

#### `stationId` (string | null)

The ID of the currently active station. Returns `null` if no station is active.

#### `stationName` (string | null)

The name of the currently active station. Returns `null` if no station is active.

#### `outletId` (string | null)

The ID of the currently active outlet. Returns `null` if no outlet is active.

#### `outletName` (string | null)

The name of the currently active outlet. Returns `null` if no outlet is active.

#### `buildId` (string | null)

The ID of the currently active build/checkout flow. Returns `null` if no build is active.

#### `buildName` (string | null)

The name of the currently active build. Returns `null` if no build is active.

#### `buildVersion` (string | null)

The version of the currently active build. Returns `null` if no build is active.

#### `buildSourceId` (string | null)

The source ID of the currently active build. This is used to identify the source/origin of the build. Returns `null` if no build is active.

#### `buildIsPremium` (boolean)

Whether the currently active build is a premium build. Defaults to `false` if no build is active.

#### `timestamp` (string)

ISO 8601 timestamp string (e.g., `"2024-01-01T00:00:00.000Z"`) indicating when the response was generated.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';
```

## Usage Examples

### Get Current Context

Retrieve all current environment information:

```typescript
import { command } from '@final-commerce/command-frame';

const context = await command.getContext();

console.log('User ID:', context.userId);
console.log('Company:', context.companyName);
console.log('Station:', context.stationName);
console.log('Build:', context.buildName);
```

### Use Context for Conditional Logic

Use context information to make decisions:

```typescript
const context = await command.getContext();

if (context.companyId === 'specific-company-id') {
    // Do something specific for this company
}

if (context.buildIsPremium) {
    // Enable premium features
}

if (context.outletId) {
    // Filter data by outlet
}
```

### Log Context for Debugging

Log context information for debugging purposes:

```typescript
const context = await command.getContext();

console.log('Current Environment:', {
    user: context.userId,
    company: context.companyName,
    station: context.stationName,
    outlet: context.outletName,
    build: `${context.buildName} (v${context.buildVersion})`,
    device: context.deviceId
});
```

### Check if Required Context is Available

Validate that required context is available before proceeding:

```typescript
const context = await command.getContext();

if (!context.userId) {
    throw new Error('User must be logged in');
}

if (!context.companyId) {
    throw new Error('Company must be selected');
}

if (!context.outletId) {
    throw new Error('Outlet must be selected');
}

// Proceed with operations that require context
```

### Error Handling

Handle errors when getting context:

```typescript
try {
    const context = await command.getContext();
    // Use context
} catch (error) {
    console.error('Failed to get context:', error);
    // Fallback behavior
}
```

## Behavior

When `getContext` is called:

1. The handler reads the current state from the Redux store
2. It extracts user information from `activeEntities.user`
3. It extracts company information from `company.activeCompany`
4. It extracts outlet information from `activeEntities.outlet`
5. It extracts station information from `activeEntities.activeStation`
6. It extracts build information from `activeEntities.activeBuild`
7. It reads device ID from localStorage (native app only)
8. All fields are returned, with `null` values for unavailable information

## Field Availability

### Always Available
- `timestamp` - Always present

### Conditionally Available
- `userId`, `userRoleId` - Available when a user is logged in
- `companyId`, `companyName` - Available when a company is selected
- `outletId`, `outletName` - Available when an outlet is selected
- `stationId`, `stationName` - Available when a station is active
- `buildId`, `buildName`, `buildVersion`, `buildSourceId`, `buildIsPremium` - Available when a build is loaded
- `deviceId` - Available in native apps, typically `null` in browser environments

## Notes

- All ID and name fields can be `null` if the corresponding entity is not active or available
- The `deviceId` is read from localStorage and may not be available in all environments
- The context reflects the current state at the time of the call
- Context information may change during the session (e.g., user logout, outlet change)
- Use this action to get a snapshot of the current environment state
- This is useful for:
  - Logging and debugging
  - Conditional feature enabling
  - Data filtering by company/outlet/station
  - Build version checking
  - User permission checking

