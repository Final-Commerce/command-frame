module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:react-hooks/recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime"
    ],
    // Test files are excluded from tsconfig (see `exclude` in tsconfig.json),
    // so the typed-linting parser can't pick them up. Skip them in ESLint
    // too — they're covered by Vitest's own typecheck.
    ignorePatterns: ["dist", ".eslintrc.cjs", "**/*.test.ts", "**/*.test.tsx"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname
    },
    rules: {
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "@typescript-eslint/no-unsafe-assignment": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
