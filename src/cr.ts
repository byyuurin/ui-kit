import type { CRRule } from './types'

export function cr(rules: CRRule[]) {
  const handlers = rules.map(([matcher, handler]) => {
    return (input: string) => {
      const context = parseInput(matcher, input)

      if (context) {
        const { matchArray, ...ctx } = context
        return handler(matchArray, ctx)
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
