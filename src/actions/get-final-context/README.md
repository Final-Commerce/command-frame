# getFinalContext

Retrieves the final context information from the parent application, specifically the project name.

## Parameters

None

## Response

### `GetFinalContextResponse`

```typescript
interface GetFinalContextResponse {
  projectName: CFProjectName; // "kaching" | "Manage"
}
```

#### `projectName` (`"kaching" | "Manage"`)

Identifies which app is hosting command-frame. In kaching, this always resolves to `projectName: 'kaching'`.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const context = await command.getFinalContext();
if (context) {
  console.log('Project Name:', context.projectName);
}
```

## Error Handling

- The return type allows for `null` if context cannot be retrieved. The kaching handler does not implement this case — it always resolves with a value and never throws.
