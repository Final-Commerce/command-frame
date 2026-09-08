# getSmartGridLayout

Fetches a builder SmartGrid layout by `gridId` from the parent application's local smart grid settings.

## Parameters

### `GetSmartGridLayoutParams`

```typescript
interface GetSmartGridLayoutParams {
  gridId: string;
}
```

#### `gridId` (required)

The id of the builder grid to fetch, matching the `gridId` a layout was previously saved under via `saveSmartGridLayout`.

## Response

### `GetSmartGridLayoutResponse`

```typescript
interface GetSmartGridLayoutResponse {
  success: boolean;
  layout: CFSmartGridLayout | null;
  timestamp: string;
}
```

```typescript
interface CFSmartGridLayout {
  gridId: string;
  cells: CFTileCell[];
  name?: string; // Operator-editable display name for the grid.
  folders?: Record<string, CFTileCell[]>; // Folder id -> its cells.
}

interface CFTileCell {
  index: number;
  type: 'empty' | 'product' | 'action' | 'category' | 'folder' | 'back';
  entityId?: string; // Product/category/folder id, action key, etc.
  entityData?: Record<string, unknown>;
}
```

`layout` is `null` only when the parent application has no smart grid settings saved at all for the current company/flow/outlet. If settings exist but don't contain this specific `gridId`, `layout` comes back as an empty grid (`{ gridId, cells: [] }`) rather than `null`.

## Errors

The returned promise rejects if:

- `gridId` is missing/empty — `Error("gridId is required")`

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

const { layout } = await command.getSmartGridLayout({ gridId: 'main-grid' });

if (layout) {
  console.log(layout.cells);
}
```

## Behavior

1. Waits for the smart grid settings collection to finish its initial sync, if it hasn't already.
2. Looks up the current company/flow/outlet's smart grid settings record from the local database.
3. Extracts the builder sub-grid stored under `gridId` and converts it to the wire `CFSmartGridLayout` shape.
4. Keeps the native SmartGrid in sync by writing the loaded settings back into local state.

See `saveSmartGridLayout`.
