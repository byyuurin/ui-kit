import type { CRRule, CRRuleContext } from './types'

export function cr(rules: CRRule[]) {
  const handlers = rules.map(([matcher, handler, options = {}]) => {
    const { scope = '' } = options

    return (input: string) => {
      const resolve = (context: CRRuleContext, value: string) => {
        const variant = (context.rawVariant ?? '')
        const groupName = scope ? `${scope}-${value}` : value
        return `${variant}${groupName}`
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
  return new RegExp(`${matcher.source.replace(/^\^|\$$/g, '')}$`)
}

export function parseInput(matcher: RegExp, className: string) {
  const variantMatcher = transformMatcher(matcher)

  if (variantMatcher.test(className)) {
    const matched = className.match(variantMatcher)!
    const [input, ...matchArray] = matched
    const rawInput = matched.input!
    const rawVariant = rawInput.slice(0, -1 * input.length)

    return {
      rawInput,
      rawVariant,
      input,
      matchArray,
    }
  }

  return null
}
