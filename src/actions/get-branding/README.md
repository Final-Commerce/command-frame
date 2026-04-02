# getBranding

Returns the Manage host’s current visual theme (colors, radius, font, logo) so an extension iframe can match the shell.

## Parameters

None.

## Response

### `GetBrandingResponse`

Includes `theme` (`light` | `dark`), `colors` (semantic tokens), `borderRadius` / `borderRadiusValue`, `font.family`, `logo` (URL or null), and `timestamp`.

See `./types.ts` for the full shape.

## Usage

```typescript
import { command } from '@final-commerce/command-frame';

const branding = await command.getBranding();
```

## Notes

- Optional on `ManageProviderActions`.
- Values are host-defined; use for styling hints only.
