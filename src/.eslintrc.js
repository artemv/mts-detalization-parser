module.exports = {
  extends: [
    "plugin:react/recommended",
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "editorconfig/editorconfig": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
  "settings": {
    "react": {
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future
    }
  }
};
