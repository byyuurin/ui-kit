import { describe, expect, it } from 'vitest'
import { cv } from './cv'

describe('cv', () => {
  const createVariants = cv([
    [/bg-(.+)/, () => 'background-color'],
  ])

  it('variants (normal)', () => {
    const ui = createVariants({
      base: 'btn',
      variants: {
        type: {
          default: 'btn-default',
          ghost: 'btn-ghost',
        },
        size: {
          sm: 'text-sm',
          md: 'text-md',
        },
        disabled: {
          true: 'btn--disabled',
        },
      },
      defaultVariants: {
        type: 'default',
      },
    })

    expect(ui().base({ class: 'btn-custom' })).toMatchInlineSnapshot(`"btn btn-default btn-custom"`)
    expect(ui({ class: 'btn-custom' }).base()).toMatchInlineSnapshot(`"btn btn-default btn-custom"`)

    expect(ui().base({ disabled: true })).toMatchInlineSnapshot(`"btn btn-default btn--disabled"`)
    expect(ui({ disabled: true }).base()).toMatchInlineSnapshot(`"btn btn-default btn--disabled"`)

    expect(ui().base({ size: 'sm' })).toMatchInlineSnapshot(`"btn btn-default text-sm"`)
    expect(ui({ size: 'sm' }).base()).toMatchInlineSnapshot(`"btn btn-default text-sm"`)
  })

  it('variants (slots)', () => {
    const ui = createVariants({
      slots: {
        root: 'btn',
        icon: 'btn__icon',
      },
      variants: {
        type: {
          default: { root: 'btn-default' },
          ghost: { root: 'btn-ghost' },
        },
        size: {
          sm: { root: 'text-sm', icon: 'text-md' },
          md: { root: 'text-md', icon: 'text-lg' },
        },
        disabled: {
          true: { root: 'btn--disabled' },
        },
      },
      defaultVariants: {
        type: 'default',
      },
    })

    expect(ui({ class: 'btn-custom' }).root()).toMatchInlineSnapshot(`"btn btn-default"`)
    expect(ui().root({ class: 'btn-custom' })).toMatchInlineSnapshot(`"btn btn-default btn-custom"`)

    expect(ui({ disabled: true }).root()).toMatchInlineSnapshot(`"btn btn-default btn--disabled"`)
    expect(ui().root({ disabled: true })).toMatchInlineSnapshot(`"btn btn-default btn--disabled"`)

    expect(ui({ size: 'sm' }).root()).toMatchInlineSnapshot(`"btn btn-default text-sm"`)
    expect(ui().icon({ size: 'sm' })).toMatchInlineSnapshot(`"btn__icon text-md"`)
  })

  it('variants (normal-compound)', () => {
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

    expect(ui().base({ type: 'default', color: 'red' })).toMatchInlineSnapshot(`"btn bg-red color-white"`)
    expect(ui({ type: 'default', color: 'red' }).base()).toMatchInlineSnapshot(`"btn bg-red color-white"`)

    expect(ui().base({ type: 'ghost', color: 'red' })).toMatchInlineSnapshot(`"btn border border-red color-red"`)
    expect(ui({ type: 'ghost', color: 'red' }).base()).toMatchInlineSnapshot(`"btn border border-red color-red"`)
  })

  it('variants (slots-compound)', () => {
    const ui = createVariants({
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

    expect(ui({ type: 'default', color: 'red' }).root()).toMatchInlineSnapshot(`"btn__root bg-red color-white"`)
    expect(ui().root({ type: 'default', color: 'red' })).toMatchInlineSnapshot(`"btn__root bg-red color-white"`)

    expect(ui({ type: 'ghost', color: 'red' }).root()).toMatchInlineSnapshot(`"btn__root border border-red color-red"`)
    expect(ui().root({ type: 'ghost', color: 'red' })).toMatchInlineSnapshot(`"btn__root border border-red color-red"`)
  })

  it('style merge', () => {
    const ui = createVariants({
      base: 'btn bg-red',
    })

    expect(ui({ class: 'bg-blue' })).toMatchInlineSnapshot(`"btn bg-blue"`)

    const uiWithSlots = createVariants({
      slots: {
        base: 'btn bg-red',
      },
    })

    expect(uiWithSlots().base({ class: 'bg-blue' })).toMatchInlineSnapshot(`"btn bg-blue"`)
  })
})
