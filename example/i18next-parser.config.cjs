/**
 * i18next-parser config — used by gate-i18n-sync to extract t() keys.
 * Output goes to node_modules/.cache/ — the canonical bundles in src/locales/
 * are written by the sync script after a round-trip with the mt server.
 */
module.exports = {
  input: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/test/**',
  ],
  output: 'node_modules/.cache/i18next-extract/$LOCALE.json',
  locales: ['en'],
  defaultNamespace: 'translation',
  keySeparator: false,
  namespaceSeparator: false,
  keepRemoved: false,
  createOldCatalogs: false,
  sort: true,
  verbose: false,
  failOnWarnings: false,
  failOnUpdate: false,
};
