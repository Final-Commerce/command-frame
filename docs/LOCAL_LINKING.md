# Using a local `command-frame` build in Render (no npm publish)

Use this while iterating on `@final-commerce/command-frame` so Render resolves your working copy instead of the registry version.

## 1. Build command-frame

From the `command-frame` repo:

```bash
npm install
npm run build
```

`prepare` runs `tsc` on install; `dist/` must exist for consumers.

## 2. Point Render at the folder

In `render/Render/package.json`, temporarily replace the dependency:

```json
"@final-commerce/command-frame": "file:../../../command-frame"
```

Adjust the relative path so it reaches your local `command-frame` package root (the folder that contains `package.json` and `dist/`).

Then from `render/Render`:

```bash
rm -rf node_modules/@final-commerce/command-frame
npm install
```

Vite/TypeScript will use the linked package. Re-run `npm run build` in `command-frame` after code changes (or `npm run dev` / `tsc --watch`).

## 3. Alternative: `npm link`

From `command-frame`:

```bash
npm link
```

From `render/Render`:

```bash
npm link @final-commerce/command-frame
```

Undo with `npm unlink @final-commerce/command-frame` and `npm install` to restore the semver dependency.

## 4. Caveats

- Commit **`file:` only if your team uses monorepo-style paths**; otherwise keep `file:` uncommitted and use link locally.
- After switching back to a published version, run `npm install` in Render to refresh the lockfile.
