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

## `ct` - A Tool for Defining Standalone UI Themes

### Simple Component Example

```js
import { ct } from '@byyuurin/ui-kit'

const theme = ct({
  base: 'p-2',
  variants: {
    type: {
      solid: 'bg-blue color-white',
      outline: 'color-blue border border-blue',
    },
  },
})
```

### Component with Slots

```js
import { ct } from '@byyuurin/ui-kit'

const theme = ct({
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
```

### Conditional Variants Example

```js
import { ct } from '@byyuurin/ui-kit'

const theme = ct({
  base: 'btn',
  variants: {
    type: {
      default: '',
      ghost: '',
    },
    color: {
      red: '',
      blue: '',
    },
  },
  compoundVariants: [
    { type: 'default', color: 'red', class: 'bg-red color-white' },
    { type: 'default', color: 'blue', class: 'bg-blue color-white' },
    { type: 'ghost', color: 'red', class: 'border border-red color-red' },
    { type: 'ghost', color: 'blue', class: 'border border-blue color-blue' },
  ],
})
```

### Using Slots with Conditional Variants

```js
import { ct } from '@byyuurin/ui-kit'

const theme = ct({
  base: 'btn-base',
  slots: {
    root: 'btn',
    icon: 'btn__icon',
  },
  variants: {
    type: {
      default: '',
      ghost: '',
    },
    color: {
      red: '',
      blue: '',
    },
  },
  compoundVariants: [
    { type: 'default', color: 'red', class: { root: 'bg-red color-white' } },
    { type: 'default', color: 'blue', class: { root: 'bg-blue color-white' } },
    { type: 'ghost', color: 'red', class: { root: 'border border-red color-red' } },
    { type: 'ghost', color: 'blue', class: { root: 'border border-blue color-blue' } },
  ],
})
```

## `cr` - A Utility for Merging Atomic Styles

Define rules for processing and merging styles. Each rule returns a group name, ensuring only the last style in the same group is retained.

```js
import { cr } from '@byyuurin/ui-kit'

const merge = cr([
  [/^bg-(.+)$/, ([type]) => {
    if (/^\[url\(.+\)\]$/.test(type))
      return 'image'

    if (/^\[image:.+\]$/.test(type))
      return 'image'

    if (/^\[(?:linear|conic|radial)-gradient\(.+\)\]$/.test(type))
      return 'image'

    if (/^\[(?:length|size):.+\]$/.test(type))
      return 'size'

    if (/^\[position:.+\]$/.test(type))
      return 'position'

    if (/^op(?:acity)?-?(.+)$/.test(type))
      return 'opacity'

    return 'color'
  }],
])

merge('border bg-red-100 sm:bg-red/10 bg-blue-200 sm:bg-blue/50') // Outputs: "border bg-blue-200 sm:bg-blue/50"
```

## `cv` - A Utility for Creating Component Variants

### Simple Component Example

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

ui() // Outputs: "p-2"
ui({ type: 'solid' }) // Outputs: "p-2 bg-blue color-white"
```

### Conditional Variants Example

```js
import { cv } from '@byyuurin/ui-kit'

const createVariants = cv()

const ui = createVariants({
  base: 'btn',
  variants: {
    type: {
      default: '',
      ghost: '',
    },
    color: {
      red: '',
      blue: '',
    },
  },
  compoundVariants: [
    { type: 'default', color: 'red', class: 'bg-red color-white' },
    { type: 'default', color: 'blue', class: 'bg-blue color-white' },
    { type: 'ghost', color: 'red', class: 'border border-red color-red' },
    { type: 'ghost', color: 'blue', class: 'border border-blue color-blue' },
  ],
})

ui({ type: 'default', color: 'red' }) // Outputs: "btn bg-red color-white"
ui({ type: 'ghost', color: 'red' }) // Outputs: "btn border border-red color-red"
```

### Component with Slots

```js
import { cv } from '@byyuurin/ui-kit'

const createVariants = cv()

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

ui().base() // Outputs: "p-2 flex items-center"
ui().icon() // Outputs: "color-white"
ui({ type: 'solid' }).base() // Outputs: "p-2 flex items-center bg-blue color-white"
ui().base({ type: 'outline' }) // Outputs: "p-2 flex items-center color-blue border border-blue"
```

### Component with Slots and Conditional Variants

```js
import { cv } from '@byyuurin/ui-kit'

const createVariants = cv()

const ui = createVariants({
  base: 'btn-base',
  slots: {
    root: 'btn',
    icon: 'btn__icon',
  },
  variants: {
    type: {
      default: '',
      ghost: '',
    },
    color: {
      red: '',
      blue: '',
    },
  },
  compoundVariants: [
    { type: 'default', color: 'red', class: { root: 'bg-red color-white' } },
    { type: 'default', color: 'blue', class: { root: 'bg-blue color-white' } },
    { type: 'ghost', color: 'red', class: { root: 'border border-red color-red' } },
    { type: 'ghost', color: 'blue', class: { root: 'border border-blue color-blue' } },
  ],
})

ui({ type: 'default', color: 'red' }).root() // Outputs: "btn bg-red color-white"
ui().root({ type: 'default', color: 'red' }) // Outputs: "btn bg-red color-white"
ui({ type: 'ghost', color: 'red' }).root() // Outputs: "btn border border-red color-red"
ui().root({ type: 'ghost', color: 'red' }) // Outputs: "btn border border-red color-red"
```

### Combining `ct` and `cv`

You can first define a theme using `ct` and then pass it to `cv` to create a variant function.

```js
import { ct, cv } from '@byyuurin/ui-kit'

const theme = ct({
  base: 'p-2',
  variants: {
    type: {
      solid: 'bg-blue color-white',
      outline: 'color-blue border border-blue',
    },
  },
})

const createVariants = cv()

const ui = createVariants(theme)
```

### Setting Atomic Style Merge Rules

You can also define atomic style merge rules when creating the variant function:

```js
import { cv } from '@byyuurin/ui-kit'

const createVariants = cv([
  [/^bg-(.+)$/, ([type]) => {
    if (/^\[url\(.+\)\]$/.test(type))
      return 'image'

    if (/^\[image:.+\]$/.test(type))
      return 'image'

    if (/^\[(?:linear|conic|radial)-gradient\(.+\)\]$/.test(type))
      return 'image'

    if (/^\[(?:length|size):.+\]$/.test(type))
      return 'size'

    if (/^\[position:.+\]$/.test(type))
      return 'position'

    if (/^op(?:acity)?-?(.+)$/.test(type))
      return 'opacity'

    return 'color'
  }],
])
```

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
