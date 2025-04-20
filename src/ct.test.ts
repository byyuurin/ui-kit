import { describe, expect, it } from 'vitest'
import { ct } from './ct'

describe('ct', () => {
  it('should return same with input', () => {
    const theme = ct({
      base: 'btn',
      slots: {
        root: 'btn__root',
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

    expect(theme).toMatchInlineSnapshot(`
      {
        "base": "btn",
        "compoundVariants": [
          {
            "class": {
              "root": "bg-red color-white",
            },
            "color": "red",
            "type": "default",
          },
          {
            "class": {
              "root": "bg-blue color-white",
            },
            "color": "blue",
            "type": "default",
          },
          {
            "class": {
              "root": "border border-red color-red",
            },
            "color": "red",
            "type": "ghost",
          },
          {
            "class": {
              "root": "border border-blue color-blue",
            },
            "color": "blue",
            "type": "ghost",
          },
        ],
        "slots": {
          "icon": "btn__icon",
          "root": "btn__root",
        },
        "variants": {
          "color": {
            "blue": "",
            "red": "",
          },
          "type": {
            "default": "",
            "ghost": "",
          },
        },
      }
    `)
  })

  it('should ignore defaultVariants in the input', () => {
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
      defaultVariants: {
        type: 'default',
        color: 'blue',
      },
    })

    expect(theme).toMatchInlineSnapshot(`
      {
        "base": "btn-base",
        "compoundVariants": [
          {
            "class": {
              "root": "bg-red color-white",
            },
            "color": "red",
            "type": "default",
          },
          {
            "class": {
              "root": "bg-blue color-white",
            },
            "color": "blue",
            "type": "default",
          },
          {
            "class": {
              "root": "border border-red color-red",
            },
            "color": "red",
            "type": "ghost",
          },
          {
            "class": {
              "root": "border border-blue color-blue",
            },
            "color": "blue",
            "type": "ghost",
          },
        ],
        "defaultVariants": {
          "color": "blue",
          "type": "default",
        },
        "slots": {
          "icon": "btn__icon",
          "root": "btn",
        },
        "variants": {
          "color": {
            "blue": "",
            "red": "",
          },
          "type": {
            "default": "",
            "ghost": "",
          },
        },
      }
    `)
  })
})
