# saveSmartGridLayout

Saves a builder SmartGrid layout into the parent application's local smart grid settings, keyed by `gridId`.

## Parameters

### `SaveSmartGridLayoutParams`

```typescript
interface SaveSmartGridLayoutParams {
    layout: CFSmartGridLayout;
}
```

```typescript
interface CFSmartGridLayout {
    gridId: string;
    cells: CFTileCell[];
    name?: string;                          // Operator-editable display name for the grid.
    folders?: Record<string, CFTileCell[]>; // Folder id -> its cells.
}

interface CFTileCell {
    index: number;
    type: "empty" | "product" | "action" | "category" | "folder" | "back";
    entityId?: string;                      // Product/category/folder id, action key, etc.
    entityData?: Record<string, unknown>;
}
```

#### `layout` (required)

The layout to save.

- `gridId` (required) — the builder grid id this layout is stored under. The call rejects if this is missing/empty.
- `cells` (required) — full replacement of the grid's tiles.
- `name` (optional) — if provided, overwrites the grid's stored display name; if omitted, the previously stored name (if any) is left as-is.
- `folders` (optional) — if provided, treated as the complete set of folder sub-grids for this `gridId` (a folder previously stored but missing from this map is removed); if the `folders` key is omitted entirely, whatever folders were previously stored for this `gridId` are left untouched.

## Response

### `SaveSmartGridLayoutResponse`

```typescript
interface SaveSmartGridLayoutResponse {
    success: boolean;
    gridId: string;
    timestamp: string;
}
```

## Errors

The returned promise rejects if:

- `layout.gridId` is missing/empty — `Error("layout.gridId is required")`
- the underlying local settings read/write fails (e.g. local database error) — the error propagates as-is

## Usage Example

```typescript
import { command } from '@final-commerce/command-frame';

const { success, gridId } = await command.saveSmartGridLayout({
    layout: {
        gridId: 'main-grid',
        cells: [
            { index: 0, type: 'product', entityId: 'prod-123' },
            { index: 1, type: 'empty' },
        ],
    },
});
```

## Behavior

1. Validates `layout.gridId` is present; throws otherwise.
2. Re-reads the current company/flow/outlet's smart grid settings record fresh from the local database (rather than from in-memory state), to avoid acting on stale data and to preserve other builder grids / the native fixed grid that may have changed since it was last loaded.
3. Merges `layout` into that record under a reserved `builderGrids[gridId]` key, leaving the native fixed grid and any other builder grids untouched:
   - `cells` fully replaces the grid's tiles.
   - `folders`, if present, fully replaces the grid's folder map; if omitted, the previously stored folders for this `gridId` are kept as-is.
   - `name`, if present, replaces the stored display name; if omitted, the previous name is kept.
4. If a settings record already existed, updates it in the local database; otherwise inserts a new settings record. Either way, the change is pushed out over sync so other devices/the backend pick it up.
5. Updates in-memory (Redux) settings state to match what was just persisted.
6. Returns `{ success: true, gridId, timestamp }`.

See `getSmartGridLayout`.
