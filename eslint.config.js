// @ts-check
import byyuurin from '@byyuurin/eslint-config'

export default byyuurin(
  {
    typescript: {
      overrides: {
        'ts/no-empty-object-type': 'off',
      },
    },
    formatters: {
      prettierOptions: {
        singleQuote: false,
      },
    },
  },
  {
    files: [
      'src/cx.test.ts',
      'README.md/*.[tj]s',
    ],
    rules: {
      'no-constant-binary-expression': 'off',
    },
  },
)
