# babel-plugin-anonymize-function-expression

[![npm](https://img.shields.io/npm/v/babel-plugin-anonymize-function-expression)](https://www.npmjs.com/package/babel-plugin-anonymize-function-expression)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI Status](https://github.com/linsk1998/babel-plugin-anonymize-function-expression/actions/workflows/ci.yml/badge.svg)](https://github.com/linsk1998/babel-plugin-anonymize-function-expression/actions)

🔧 A Babel plugin that converts named function expressions to anonymous functions, designed to:
- **Fix Compatibility Issues** - Eliminate identifier leaks in legacy environments (IE6-8)
- **Reduce Bundle Size** - Optimize production code by removing redundant identifiers
- **Enforce Code Quality** - Seamlessly integrate with ESLint rules for consistent code style

⚠️ **Note**: This functionality is fully covered by Terser's `ie8: true` option in production builds.
Use this plugin only if you need uncompressed IE8-compatible code during development.

## When to Use This Plugin?

### 🛠️ **Recommended Workflow**
| Scenario                  | Solution                     | Advantages                          |
|---------------------------|------------------------------|-------------------------------------|
| Production builds         | Terser with `ie8: true`      | Smaller bundle + IE8 fixes          |
| Development debugging     | This plugin                  | Readable code with IE8 compatibility|


## Features

### 🛡️ **Legacy Browser Support**
```javascript
// Input
const logger = function debug() {};

// Transformed Output
const logger = function() {};
```
- Fixes identifier leakage in IE6-8 environments
- Preserves original function behavior while removing names

### Handling Recursive Functions

When a function expression references its own name (e.g., recursion), this plugin preserves the name to avoid breaking self-references. Use `@babel/plugin-transform-jscript` after this plugin to wrap such cases in an IIFE, completely eliminating the leaked identifier:

```javascript
// Input
const countdown = function timer(n) {
  return n > 0 ? timer(n - 1) : 0;
};

// After anonymize-function-expression (name preserved due to self-reference)
const countdown = function timer(n) {
  return n > 0 ? timer(n - 1) : 0;
};

// After @babel/plugin-transform-jscript (IIFE wrapping)
const countdown = function () {
  function timer(n) {
    return n > 0 ? timer(n - 1) : 0;
  }
  return timer;
}();
```

## Installation & Usage

### Install
```bash
npm install --save-dev babel-plugin-anonymize-function-expression
```

### Configuration
```javascript
// babel.config.js
module.exports = {
  plugins: [
    'anonymize-function-expression'
  ]
};
```

This plugin should run before the `@babel/plugin-transform-jscript` plugin to handle recursive functions:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    'anonymize-function-expression',
    '@babel/plugin-transform-jscript'
  ]
};
```

## 🔗 **ESLint Integration**
Pair with [eslint-plugin-ts-compat/no-function-name](https://github.com/linsk1998/eslint-plugin-ts-compat/blob/HEAD/docs/rules/no-function-name.md) for development-time enforcement:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['ts-compat'],
  rules: {
    'ts-compat/no-function-name': 'error' // Block named function expressions
  }
};
```

This combination:
- Prevents named function expressions during development
- Ensures build output matches source code conventions
