# @final-commerce/command-frame

A TypeScript library for type-safe communication between iframes and their parent windows in the Final Commerce ecosystem.

## Overview

Command Frame provides a structured way to build integrations that run inside Final Commerce applications (like Render POS or Manage Dashboard). It handles the underlying `postMessage` communication while enforcing strict type safety for both the host application (Provider) and the embedded app (Client).

## Installation

```bash
npm install @final-commerce/command-frame
```

## Available Integrations

This library supports multiple host environments. Choose the client that matches the platform you are building for.

### 1. Render (POS System)

For building applications that run inside the Render Point of Sale interface.

- **[Render Documentation](./src/projects/render/README.md)**
- **Features:** Order management, Product catalog, Customer management, Payments, Hardware integration (Cash drawer, Printer).

**Quick Start:**

```typescript
import { RenderClient } from '@final-commerce/command-frame';

// Initialize the client
const client = new RenderClient();

// Use typed methods
const products = await client.getProducts();
```

### 2. Manage (Dashboard)

For building applications that run inside the Final Commerce Management Dashboard.

- **[Manage Documentation](./src/projects/manage/README.md)**
- **Features:** Context information, Dashboard widgets (More coming soon).

**Quick Start:**

```typescript
import { ManageClient } from '@final-commerce/command-frame';

const client = new ManageClient();
const context = await client.getContext();
```

## Development & Testing

### Demo Mode / Mocking

Each client comes with built-in mock data for local development.

- If the application detects it is not running inside a valid host iframe, it automatically switches to **Mock Mode**.
- In Mock Mode, all API calls return local dummy data instead of failing.
- You can force Mock Mode by passing `mockMode: true` to the client constructor.

```typescript
const client = new RenderClient({ mockMode: true, debug: true });
```

### Debugging

Enable debug logging to see all message passing activity in the console:

```typescript
const client = new RenderClient({ debug: true });
```

Alternatively, set the global flag before initialization:

```typescript
(window as any).__POSTMESSAGE_DEBUG__ = true;
```

## License

MIT
