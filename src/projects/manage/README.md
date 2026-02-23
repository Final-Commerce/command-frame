# Manage Integration

Client and Provider implementation for the Manage Dashboard environment.

## API Reference

### [getContext](../../../actions/get-context/README.md)
Retrieve current user and environment context.

### [getFinalContext](../../../actions/get-final-context/README.md)
Retrieve project identification.

### [getSecretsKeys](../../../actions/get-secrets-keys/README.md)
Retrieve the list of secret keys (company-level or extension-scoped).

### [getSecretVal](../../../actions/get-secret-val/README.md)
Retrieve a secret value by key.

### [setSecretVal](../../../actions/set-secret-val/README.md)
Create or update a secret value.

## Usage

```typescript
import { ManageClient } from '@final-commerce/command-frame';

const client = new ManageClient();
const context = await client.getContext();
```

