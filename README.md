# @byyuurin/ui-kit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

## [ct](./src/ct.ts) - helper for creating component themes

normal component

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
  // ...
})
```

component with slots

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
  // ...
})
```

## [cv](./src/cv.ts) - utility for creating ui variants

normal component

```js
import { cv } from '@byyuurin/ui-kit'

const ui = cv({
  base: 'p-2',
  variants: {
    type: {
      solid: 'bg-blue color-white',
      outline: 'color-blue border border-blue',
    },
  },
  // ...
})

ui() // "p-2"

ui({ type: 'solid' }) // "p-2 bg-blue color-white"
```

component with slots

```js
import { cv } from '@byyuurin/ui-kit'

const ui = cv({
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
  // ...
})

ui().base() // "p-2 flex items-center"
ui().icon() // "color-white"

ui({ type: 'solid' }).base() // "p-2 flex items-center bg-blue color-white"
ui().base({ type: 'outline' }) // "p-2 flex items-center color-blue border border-blue"
```

You can use it with `ct`

```js
import { ct, cv } from '@byyuurin/ui-kit'

const buttonTheme = ct({
  base: 'p-2',
  variants: {
    type: {
      solid: 'bg-blue color-white',
      outline: 'color-blue border border-blue',
    },
  },
})

const uiButton = cv(buttonTheme)
```

## [cr](./src/cr.ts) - utility for replace/merge classNames

## License

[MIT](./LICENSE) License © 2024-PRESENT [Yuurin](https://github.com/byyurin)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@byyuurin/ui-kit
[npm-downloads-src]: https://img.shields.io/npm/dm/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@byyuurin/ui-kit
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@byyuurin/ui-kit?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@byyuurin/ui-kit
[license-src]: https://img.shields.io/github/license/byyuurin/@byyuurin/ui-kit.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/byyuurin/@byyuurin/ui-kit/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@byyuurin/ui-kit
