module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "react/no-array-index-key": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/no-did-update-set-state": "error",
    "no-param-reassign": "error",
    "no-restricted-syntax": "off",
  },
  ignorePatterns: ["**/build/*", "**/__tests__/*"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
