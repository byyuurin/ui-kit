import { describe, expect, it } from 'vitest'
import { createCR, parseInput, transformInputRule } from './cr'
import type { CRRule } from './types'

describe('cr', () => {
  const matcherWithoutTransform = /^bg-(.+)$/
  const matcherTransformed = /^(.+?[:-])bg-(.+)$/

  describe('matcher transform', () => {
    it('should be same matcher', () => {
      const matcher = transformInputRule(matcherWithoutTransform)
      expect(matcher).toEqual(matcherTransformed)
    })
  })

  describe('input context', () => {
    it('should return null', () => {
      const context = parseInput(matcherWithoutTransform, 'sm:border-0')
      expect(context).toMatchInlineSnapshot(`null`)
    })

    it('should return context with empty rawVariant', () => {
      const context = parseInput(matcherWithoutTransform, 'bg-red-100:50')

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
      const context = parseInput(matcherWithoutTransform, 'children:bg-red-100:50')

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
      [
        /^bg-(.+)$/,
        ([type]) => {
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
        },
        { scope: 'bg' },
      ],
      // _rules/gap
      [
        /^(?:flex-|grid-)?gap(?:-([xy]|col|row))?(.+)$/,
        ([direction]) => {
          if (direction === 'y' || direction === 'row')
            return 'row-gap'

          if (direction === 'x' || direction === 'col')
            return 'column-gap'

          return 'gap'
        },
      ],
    ]

    it('merge mode', () => {
      const cr = createCR(rules)
      const result = cr('border bg-red-100 sm:bg-red/10 bg-blue-200 sm:bg-blue/50')
      expect(result).toMatchInlineSnapshot(`"border bg-blue-200 sm:bg-blue/50"`)
    })

    it('debug mode', () => {
      const cr = createCR(rules, { debug: true })
      const result = cr('gap-1 flex-gap-2 grid-gap-x-3 gap4 sm:flex-gap5 md:grid-gap--6')
      expect(result).toMatchInlineSnapshot(`"gap gap column-gap gap sm:gap md:gap"`)
    })
  })
})
