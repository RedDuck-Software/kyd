const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended", 'plugin:react-hooks/recommended'],
  plugins: ["only-warn", 'react-refresh',"prettier", "@typescript-eslint", "react-hooks"],
  env: {
    browser: true,
    es2020: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    ".*.cjs",
    "node_modules/*",
    "dist/*",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
      rules: {
        "import/order": [
          "error",
          {
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
            groups: [
              "external",
              "builtin",
              "index",
              "sibling",
              "parent",
              "internal",
              "object",
            ],
            "newlines-between": "always",
          },
        ],
        "prettier/prettier": [
          "error",
          {
            endOfLine: "auto",
            semi: true,
            singleQuote: true,
            trailingComma: "all",
          },
        ],
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
    },
  ],
};
