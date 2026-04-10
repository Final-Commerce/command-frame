# updateCustomerFacingDisplay (deprecated / not exported)

`command.updateCustomerFacingDisplay` is **not exported** from the current package API (`src/index.ts`).

This page is kept only as historical context for older integrations that may have implemented a host-side custom action with this name.

## Current status

- Not available on the `command` object from `@final-commerce/command-frame`.
- No first-class action implementation exists in `src/actions/*/action.ts`.

## Recommended alternatives

- For POS-facing UI feedback, use [`showNotification`](../show-notification/README.md) and [`showConfirmation`](../show-confirmation/README.md).
- For custom host workflows, implement a host-specific action and document it within your integration project.

