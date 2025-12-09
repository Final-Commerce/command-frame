# getFinalContext

Retrieves the final context information from the parent application, specifically the project name.

## Parameters

None

## Response

### `GetFinalContextResponse`

```typescript
interface GetFinalContextResponse {
    projectName: string;
}
```

#### `projectName` (string)

The name of the current project context.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const context = await command.getFinalContext();
if (context) {
    console.log('Project Name:', context.projectName);
}
```

## Error Handling

- Returns `null` if context cannot be retrieved.

