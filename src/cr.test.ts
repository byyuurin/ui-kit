import { describe, expect, it } from 'vitest'
import { cr, parseInput, transformMatcher } from './cr'
import type { CRRule } from './types'

describe('cr', () => {
  const matcherWithoutTransform = /^bg-(.+)$/
  const matcherTransformed = /^((?:.+)[-:])?bg-(.+)$/

  describe('matcher transform', () => {
    it('should return the transformed matcher', () => {
      const matcher = transformMatcher(matcherWithoutTransform)
      expect(matcher).toEqual(matcherTransformed)
    })

    it('should be same matcher', () => {
      const matcher = transformMatcher(matcherTransformed)
      expect(matcher).toEqual(matcherTransformed)
    })
  })

  describe('input context', () => {
    it('should return null', () => {
      const context = parseInput(matcherWithoutTransform, 'sm:border-0')
      expect(context).toMatchInlineSnapshot(`null`)
    })

    it('should return context with undefined rawVariant', () => {
      const context = parseInput(matcherTransformed, 'bg-red-100:50')

      expect(context).toMatchInlineSnapshot(`
        {
          "input": "bg-red-100:50",
          "matchArray": [
            "red-100:50",
          ],
          "rawInput": "bg-red-100:50",
          "rawVariant": "",
        }
      `)
    })

    it('should return context with rawVariant', () => {
      const context = parseInput(matcherTransformed, 'children:bg-red-100:50')

      expect(context).toMatchInlineSnapshot(`
        {
          "input": "bg-red-100:50",
          "matchArray": [
            "red-100:50",
          ],
          "rawInput": "children:bg-red-100:50",
          "rawVariant": "children:",
        }
      `)
    })
  })

  describe('merger', () => {
    const rules: CRRule[] = [
      [/^bg-(.+)$/, ([type], context) => {
        const { rawVariant = '' } = context
        const r = (groupKey: string) => `${rawVariant}bg-${groupKey}`

        if (/^\[url\(.+\)\]$/.test(type))
          return r('image')

        if (/^\[image:.+\]$/.test(type))
          return r('image')

        if (/^\[(?:linear|conic|radial)-gradient\(.+\)\]$/.test(type))
          return r('image')

        if (/^\[(?:length|size):.+\]$/.test(type))
          return r('size')

        if (/^\[position:.+\]$/.test(type))
          return r('position')

        if (/^op(?:acity)?-?(.+)$/.test(type))
          return r('opacity')

        return r('color')
      }],
    ]

    it('test', () => {
      const merger = cr(rules)
      const result = merger('border bg-red-100 sm:bg-red/10 bg-blue-200 sm:bg-blue/50')
      expect(result).toMatchInlineSnapshot(`"border bg-blue-200 sm:bg-blue/50"`)
    })
  })
})
