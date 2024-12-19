import type { CRRule, CRRuleContext } from './types'

export function cr(rules: CRRule[]) {
  const handlers = rules.map(([matcher, handler]) => {
    const id = matcher.source.replace(/^\^|\$$/g, '')

    return (input: string) => {
      const resolve = (context: CRRuleContext, value: string) => {
        const groupKey = (context.rawVariant ?? '') + id
        return `${groupKey}-${value}`
      }

      const data = parseInput(matcher, input)

      if (data) {
        const { matchArray, ...context } = data
        const value = handler(matchArray, context)
        return typeof value === 'string' ? resolve(context, value) : null
      }

      return null
    }
  })

  return (className: string) => {
    const classNames = className.split(/\s+/)
    const temp = new Map<string, string>([])

    for (const className of classNames) {
      let groupKey = className

      handlers.some((handler) => {
        const key = handler(className)

        if (key) {
          groupKey = key
          return true
        }

        return false
      })

      temp.set(groupKey, className)
    }

    return Array.from(temp.values()).join(' ')
  }
}

export function transformMatcher(matcher: RegExp) {
  const prefix = '^((?:.+)[-:])?'

  if (matcher.source.startsWith(prefix))
    return matcher

  const source = matcher.source.replace(/^\^|\$$/g, '')
  return new RegExp(`${prefix}${source}$`)
}

export function parseInput(matcher: RegExp, className: string) {
  const _matcher = transformMatcher(matcher)
  const [rawInput, rawVariant = '', ...matchArray] = className.match(_matcher) ?? []

  if (!rawInput)
    return null

  let input = rawInput

  if (rawVariant)
    input = rawInput.slice(rawVariant.length)

  return {
    rawInput,
    rawVariant,
    input,
    matchArray,
  }
}
