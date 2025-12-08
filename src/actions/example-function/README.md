# exampleFunction

**Note:** This is an example/template function for demonstration purposes. It shows the basic structure of how actions work in the commands-frame library.

## Overview

This function serves as a reference implementation for creating new actions. It demonstrates:
- Parameter definition
- Response structure
- Type safety
- Basic communication pattern

## Parameters

### `ExampleFunctionParams`

```typescript
interface ExampleFunctionParams {
    param1?: string;
    param2?: string;
    param3?: string;
}
```

All parameters are optional. This is just an example structure.

## Response

### `ExampleFunctionResponse`

```typescript
interface ExampleFunctionResponse {
    receivedParams: ExampleFunctionParams;
    responsePayload: {
        field1: string;
        field2: string;
        field3: string;
    };
    timestamp: string;
    processed: boolean;
}
```

## Usage

```typescript
import { commands } from '@final-commerce/command-frame';
```

## Usage Example

```typescript
const result = await commands.exampleFunction({
    param1: 'value1',
    param2: 'value2',
    param3: 'value3'
});

console.log(result.responsePayload);
```

## Notes

- This is a template/example function
- Replace this with actual business logic when creating real actions
- Follow the same structure for new actions:
  1. Define types in `types.ts`
  2. Implement action in `action.ts`
  3. Export from `index.ts`
  4. Create documentation in `README.md`

