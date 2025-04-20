# @byyuurin/ui-kit

A utility toolkit for designing themed UI components.

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

## Installation

```bash
npm i @byyuurin/ui-kit
```

## `cv` - A Utility for Creating Component Variants

`cv` simplifies defining UI component variants with conditional styling and slot support.

### Basic Usage

```js
import { cv } from '@byyuurin/ui-kit'

const createVariants = cv()

const ui = createVariants({
  base: 'p-2',
  variants: {
    type: {
      solid: 'bg-blue color-white',
      outline: 'color-blue border border-blue',
    },
  },
})

ui({ type: 'solid' }).base() // "p-2 bg-blue color-white"
```

### Conditional Variants

```js
const ui = createVariants({
  base: 'btn',
  variants: {
    type: { default: '', ghost: '' },
    color: { red: '', blue: '' },
  },
  compoundVariants: [
    { type: 'default', color: 'red', class: 'bg-red color-white' },
    { type: 'ghost', color: 'red', class: 'border border-red color-red' },
  ],
})

ui({ type: 'default', color: 'red' }).base() // "btn bg-red color-white"
```

### Slots Support

```js
const ui = createVariants({
  slots: {
    base: 'p-2 flex items-center',
    icon: 'color-white',
  },
  variants: {
    type: {
      solid: { base: 'bg-blue color-white' },
      outline: { base: 'color-blue border border-blue' },
    },
  },
})

ui({ type: 'solid' }).base() // "p-2 flex items-center bg-blue color-white"
```

### Merging with `ct`

You can define a theme with `ct` and pass it to `cv`:

```js
import { ct, cv } from '@byyuurin/ui-kit'

const theme = ct({ base: 'p-2', variants: { type: { solid: 'bg-blue' } } })
const createVariants = cv()
const ui = createVariants(theme)
```

### Custom Merge Rules

```js
const createVariants = cv([
  [/^bg-(.+)$/, ([type]) => {
    if (/^op(?:acity)?-?(.+)$/.test(type))
      return 'opacity'

    return 'color'
  }],
])

// Define UI variants
const ui = createVariants({
  base: 'p-2 bg-blue bg-opacity-80 hover:bg-opacity-100',
})

// Example Usage
ui().base() // "p-2 bg-blue bg-opacity-80 hover:bg-opacity-100"
ui().base({ class: 'bg-red bg-opacity-50' }) // "p-2 bg-red bg-opacity-50 hover:bg-opacity-100"
```

`cv` offers a powerful way to manage component variants with conditional logic and atomic styling.

## `cx` - A Utility for Merging Class Names

`cx` is a simple utility for merging class names based on different conditions.

### Usage

```js
import { cx } from '@byyuurin/ui-kit'

cx('btn', 'primary') // "btn primary"
cx('btn', { primary: true, disabled: false }) // "btn primary"
cx('btn', ['primary', false && 'disabled']) // "btn primary"
```

It works with strings, objects, and arrays, making it easy to conditionally combine class names.

## License

[MIT](./LICENSE) License © 2024-PRESENT [Yuurin](https://github.com/byyurin)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@byyuurin/ui-kit
[npm-downloads-src]: https://img.shields.io/npm/dm/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@byyuurin/ui-kit
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@byyuurin/ui-kit
[license-src]: https://img.shields.io/github/license/byyuurin/ui-kit.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/byyuurin/ui-kit/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@byyuurin/ui-kit
