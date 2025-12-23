# Manage Integration

Client and Provider implementation for the Manage Dashboard environment.

## API Reference

### [getContext](../../../actions/get-context/README.md)
Retrieve current user and environment context.

### [getFinalContext](../../../actions/get-final-context/README.md)
Retrieve project identification.

## Usage

```typescript
import { ManageClient } from '@final-commerce/command-frame';

const client = new ManageClient();
const context = await client.getContext();
```

