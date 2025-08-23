import jsdoc from 'eslint-plugin-jsdoc'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import noOnlyTests from 'eslint-plugin-no-only-tests'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import stylistic from '@stylistic/eslint-plugin'

export default [{
  ignores: [
    "**/node_modules",
    "**/dist"
  ],
}, {
  files: ["**/*.ts"],
  plugins: {
    jsdoc,
    "@typescript-eslint": typescriptEslint,
    "no-only-tests": noOnlyTests,
    "@stylistic": stylistic
  },

  languageOptions: {
    globals: {
      ...globals.node
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "module",

    parserOptions: {
      project: "tsconfig.json"
    },
  },

  rules: {
    "@stylistic/brace-style": ["error", "1tbs", {
      allowSingleLine: true
    }],

    "@stylistic/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "none",
        requireLast: true
      },

      singleline: {
        delimiter: "semi",
        requireLast: false
      },
    }],

    "@stylistic/quotes": ["error", "single", {
      allowTemplateLiterals: "always"
    }],

    "@stylistic/semi": ["error", "never"],
    "@stylistic/type-annotation-spacing": "error",
    "@stylistic/keyword-spacing": "error",
    "@stylistic/comma-spacing": "error",
    "@stylistic/key-spacing": "error",
    "@stylistic/no-multi-spaces": "error",
    "@stylistic/switch-colon-spacing": "error",

    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": ["error", {
      checksVoidReturn: false
    }],

    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/dot-notation": "off",

    "@typescript-eslint/explicit-member-accessibility": ["off", {
      accessibility: "explicit"
    }],

    "@typescript-eslint/member-ordering": "error",

    "@typescript-eslint/naming-convention": ["error", {
      selector: "variable",
      format: ["camelCase", "UPPER_CASE"]
    }, {
        selector: "function",
        format: ["camelCase", "PascalCase"]
      }, {
        selector: "typeLike",
        format: ["PascalCase"]
      }, {
        selector: "enumMember",
        format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"]
      }, {
        selector: "parameterProperty",
        format: ["camelCase", "UPPER_CASE"]
      }, {
        selector: "classProperty",
        format: ["camelCase", "snake_case", "UPPER_CASE"]
      }, {
        selector: "objectLiteralProperty",
        format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"]
      }, {
        selector: "typeProperty",
        format: ["camelCase", "snake_case"]
      }, {
        selector: "default",
        format: ["camelCase"]
      }, {
        selector: "import",
        format: ["PascalCase", "camelCase"]
      }],

    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-require-imports": "off",

    "@typescript-eslint/no-shadow": ["error", {
      hoist: "all"
    }],

    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-unused-vars": "error",

    "@typescript-eslint/no-use-before-define": ["error", {
      functions: false
    }],

    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/triple-slash-reference": "off",
    "comma-dangle": "error",
    curly: "error",
    "default-case": "error",
    "dot-notation": "off",
    "eol-last": "error",
    eqeqeq: ["error", "smart"],
    "id-match": "error",

    indent: ["error", 2, {
      SwitchCase: 1
    }],

    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "error",

    "jsdoc/tag-lines": ["error", "any", {
      startLines: 1
    }],

    "no-bitwise": "off",
    "no-caller": "error",
    "no-cond-assign": "error",

    "no-console": ["error", {
      allow: [
        "warn",
        "dir",
        "timeLog",
        "assert",
        "clear",
        "count",
        "countReset",
        "group",
        "groupEnd",
        "table",
        "dirxml",
        "error",
        "groupCollapsed",
        "Console",
        "profile",
        "profileEnd",
        "timeStamp",
        "context"
      ],
    }],

    "no-debugger": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-invalid-this": "error",

    "no-multiple-empty-lines": ["error", {
      max: 1
    }],

    "no-new-wrappers": "error",
    "no-redeclare": "error",
    "no-trailing-spaces": "error",
    "no-underscore-dangle": "error",
    "no-unused-labels": "error",
    "no-var": "error",
    "prefer-const": "error",
    radix: "error",

    "spaced-comment": ["error", "always", {
      markers: ["/"]
    }],

    "use-isnan": "error",

    "no-only-tests/no-only-tests": "error"
  },
}]