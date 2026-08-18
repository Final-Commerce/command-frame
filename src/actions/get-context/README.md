# getContext

Retrieves the current environment/context information from the parent application. This includes user, company, device, station, outlet, build, currency/formatting, and connectivity information.

## Parameters

This action takes no parameters.

## Response

### `GetContextResponse`

```typescript
interface GetContextResponse {
    userId: string | null;
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
    isOffline: boolean;
    currency: string | null;
    minorUnits: number | null;
    currencySymbol: string | null;
    currencyPrefix: string | null;
    currencySuffix: string | null;
    thousandSeparator: string | null;
    decimalSeparator: string | null;
    timestamp: string;
    user: Record<string, any> | null;
    company: Omit<Record<string, any>, 'settings'> | null;
    station: Record<string, any> | null;
    outlet: Record<string, any> | null;
}
```

### Example Response

Here's an example of a complete `getContext` response:

```json
{
  "userId": "691df9c2047bfc55994d703f",
  "companyId": "691df9c4c478bada1fb23bff",
  "companyName": "Demo Company",
  "deviceId": null,
  "stationId": "691df9c6c478bada1fb23c96",
  "stationName": "widnows-test-deviceinfo",
  "outletId": "691df9c6c478bada1fb23c7b",
  "outletName": "Final Swag Store",
  "buildId": "6930d36f5506016baa1e4775",
  "buildName": "Iframe commands Vite",
  "buildVersion": "1.0.19",
  "buildSourceId": "6925a362399e8c44aab261d8",
  "buildIsPremium": false,
  "isOffline": false,
  "currency": "USD",
  "minorUnits": 2,
  "currencySymbol": "$",
  "currencyPrefix": "$",
  "currencySuffix": "",
  "thousandSeparator": ",",
  "decimalSeparator": ".",
  "timestamp": "2025-12-08T19:22:20.820Z",
  "user": {
    "id": "691df9c2047bfc55994d703f",
    "firstName": "TestStaging",
    "lastName": "TestStaging",
    "outlets": [],
    "companies": [
      {
        "$oid": "691df9c2047bfc55994d703c"
      },
      {
        "$oid": "691df9c4c478bada1fb23bff"
      }
    ],
    "type": "organization_owner",
    "role": {
      "name": "",
      "permissions": []
    }
  },
  "company": {
    "isDeleted": false,
    "createdAt": "2025-11-19T17:09:24.024Z",
    "updatedAt": "2025-11-19T17:09:24.024Z",
    "accountId": "691df9c2047bfc55994d7037",
    "address": {
      "address1": "139 Water St",
      "address2": "Suite 3000",
      "city": "St. John's",
      "country": "CA",
      "state": "NL",
      "postCode": "A1C 1B2"
    },
    "shipping": {
      "address1": "7B Anderson Avaneu",
      "address2": "139 water street",
      "city": "St.John's",
      "country": "CA",
      "state": "NL",
      "postCode": "A1B3E1"
    },
    "type": "company",
    "logo": "https://storage.googleapis.com/attachments-dev-1/67acb3631472fc5ce7ebf304/1741785745144_App Icon.png",
    "billingManagement": "self",
    "name": "Demo Company",
    "platform": 0,
    "libraries": "open",
    "organizationId": "691df9c2047bfc55994d703c",
    "registrationCompleted": true,
    "stripe": {
      "stripeAccountId": "acct_1QxRuK2aJQdty8LG",
      "stripeCustomerId": "cus_RlDaGkzqpBQp7q",
      "stripeSubscriptionId": "sub_1Qrh9HFEFc9T4WKriW8n3En5",
      "stripeSubscriptionStatus": "trialing"
    },
    "isSyncing": {
      "company": "done"
    },
    "industry": "payment_facility",
    "showStartingGuide": true,
    "isDemoCompany": true,
    "__v": 0,
    "plan": {
      "_id": "691df9c7c478bada1fb23e67",
      "companyId": "691df9c4c478bada1fb23bff",
      "planId": "691df9c2047bfc55994d7044",
      "isDeleted": false,
      "createdAt": "2025-11-19T17:09:27.063Z",
      "updatedAt": "2025-11-19T17:09:27.063Z",
      "__v": 0
    },
    "planData": {
      "_id": "691df9c2047bfc55994d7044",
      "name": "Default",
      "description": "default plan for all newly onboarded companies",
      "organizationId": "691df9c2047bfc55994d703c",
      "checkoutFlows": null,
      "extensions": null,
      "isDeleted": false,
      "createdAt": "2025-11-19T17:09:22.123Z",
      "updatedAt": "2025-11-19T17:09:22.123Z",
      "__v": 0
    },
    "id": "691df9c4c478bada1fb23bff"
  },
  "station": {
    "_id": "691df9c6c478bada1fb23c96",
    "isDeleted": false,
    "createdAt": "2025-10-17T18:22:48.713Z",
    "updatedAt": "2025-11-19T17:09:26.883Z",
    "outletId": "691df9c6c478bada1fb23c7b",
    "companyId": "691df9c4c478bada1fb23bff",
    "name": "widnows-test-deviceinfo",
    "status": "IN_USE",
    "terminals": [],
    "deviceId": null,
    "__v": 0,
    "sequenceNumber": 5,
    "meta": {
      "revision": 0,
      "created": 1764960692038,
      "version": 0
    },
    "$loki": 21
  },
  "outlet": {
    "_id": "691df9c6c478bada1fb23c7b",
    "isDeleted": false,
    "createdAt": "2025-03-26T12:50:18.046Z",
    "updatedAt": "2025-11-19T17:09:26.801Z",
    "address": "139 Water St, St. John's, NL A1C 1B1, Canada",
    "city": "St. John's",
    "companyId": "691df9c4c478bada1fb23bff",
    "country": "CA",
    "name": "Final Swag Store",
    "postCode": "A1C 1B1",
    "state": "NL",
    "sequenceNumber": 1,
    "stations": [
      "691df9c6c478bada1fb23c8e",
      "691df9c6c478bada1fb23c8f",
      "691df9c6c478bada1fb23c96"
    ],
    "taxId": "GST",
    "__v": 0,
    "meta": {
      "revision": 0,
      "created": 1764960691924,
      "version": 0
    },
    "$loki": 1,
    "id": "691df9c6c478bada1fb23c7b"
  }
}
```

**Note:** The `company` object in the response excludes the `settings` field. All other fields from the company object are included.

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

The ID of the currently active build/checkout flow. **Sourced from the active Flow's `_id`** — kaching runs flows rather than the legacy build/checkout-flow entity, so this field is populated from the active flow. Returns `null` if no flow is active.

#### `buildName` (string | null)

The name of the currently active build. **Sourced from the active Flow's `title`.** Returns `null` if no flow is active.

#### `buildVersion` (string | null)

The version of the currently active build. **Sourced from the active Flow's `currentVersion`.** Returns `null` if no flow is active.

#### `buildSourceId` (string | null)

The source ID of the currently active build. This is used to identify the source/origin of the build. **Sourced from the active Flow's `webAppId`.** Returns `null` if no flow is active.

#### `buildIsPremium` (boolean)

Whether the currently active build is a premium build. **Always `false`** — flows have no premium tier, so this field is hardcoded and does not reflect the active flow's state.

#### `isOffline` (boolean)

Whether the app currently has no network connectivity (derived from `navigator.onLine`).

#### `currency` (string | null)

The ISO currency code of the active company (e.g. `"USD"`). Returns `null` if no company/currency is configured.

#### `minorUnits` (number | null)

The number of decimal places in the currency's minor unit (e.g. `2` for USD, `0` for JPY). **All money amounts elsewhere in this API are integers in minor units** (e.g. $15.75 is `1575`) — use this value to convert to/from user-facing decimal amounts. Returns `null` if no currency is configured.

#### `currencySymbol` (string | null)

The currency symbol (e.g. `"$"`). Returns `null` if no currency is configured.

#### `currencyPrefix` (string | null)

The string to prepend when formatting an amount (e.g. `"$"`). Returns `null` if not configured.

#### `currencySuffix` (string | null)

The string to append when formatting an amount (e.g. `""`). Returns `null` if not configured.

#### `thousandSeparator` (string | null)

The character used to separate thousands when formatting an amount (e.g. `","`). Returns `null` if not configured.

#### `decimalSeparator` (string | null)

The character used to separate the integer and fractional parts when formatting an amount (e.g. `"."`). Returns `null` if not configured.

#### `timestamp` (string)

ISO 8601 timestamp string (e.g., `"2024-01-01T00:00:00.000Z"`) indicating when the response was generated.

#### `user` (Record<string, any> | null)

The full user object containing all user information (e.g., firstName, lastName, role, id, outlets, type, companies). Returns `null` if no user is logged in.

#### `company` (Omit<Record<string, any>, 'settings'> | null)

The full company object containing all company information except the `settings` field (e.g., id, name, logo, createdAt, registrationCompleted, platform, outlets, stripe). Returns `null` if no company is active.

#### `station` (Record<string, any> | null)

The full station object containing all station information (e.g., _id, name, status, sequenceNumber, buildSrcId, buildVersion, publishBuildId, createdAt, updatedAt, stripeTerminalId). Returns `null` if no station is active.

#### `outlet` (Record<string, any> | null)

The full outlet object containing all outlet information (e.g., id, _id, name, address, address2, city, state, country, taxId, postCode, stripe, sequenceNumber, stripeAccountId). Returns `null` if no outlet is active.

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
console.log('Full user object:', context.user);
console.log('Company:', context.companyName);
console.log('Full company object:', context.company);
console.log('Station:', context.stationName);
console.log('Full station object:', context.station);
console.log('Full outlet object:', context.outlet);
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
2. It extracts user information from `activeShell.user` (returns full user object)
3. It extracts company information from `company.activeCompany` (returns full company object without `settings` field)
4. It extracts outlet information from `activeShell.outlet` (returns full outlet object)
5. It extracts station information from `activeShell.activeStation` (returns full station object)
6. It extracts build information from `activeShell.activeFlow` — kaching runs flows, not the legacy build/checkout-flow entity, so `buildId`/`buildName`/`buildVersion`/`buildSourceId` are populated from the active flow's `_id`/`title`/`currentVersion`/`webAppId`, and `buildIsPremium` is hardcoded to `false` (flows have no premium tier)
7. It extracts currency/formatting information (`currency`, `minorUnits`, `currencySymbol`, `currencyPrefix`, `currencySuffix`, `thousandSeparator`, `decimalSeparator`) from the active company's settings
8. It computes `isOffline` from the browser's `navigator.onLine` status
9. It reads device ID from localStorage (native app only)
10. All fields are returned, with `null` values for unavailable information

## Field Availability

### Always Available
- `timestamp` - Always present
- `isOffline` - Always present (network status)
- `buildIsPremium` - Always present, but hardcoded to `false`

### Conditionally Available
- `userId`, `user` - Available when a user is logged in
- `companyId`, `companyName`, `company` - Available when a company is selected (company object excludes `settings` field)
- `outletId`, `outletName`, `outlet` - Available when an outlet is selected
- `stationId`, `stationName`, `station` - Available when a station is active
- `buildId`, `buildName`, `buildVersion`, `buildSourceId` - Available when a flow is active (sourced from the active Flow, not a separate build entity)
- `currency`, `minorUnits`, `currencySymbol`, `currencyPrefix`, `currencySuffix`, `thousandSeparator`, `decimalSeparator` - Available when the active company has currency/formatting settings configured
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

