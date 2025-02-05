import type { CRRule, CRRuleContext } from './types'

interface CROptions {
  debug?: boolean
}

export function cr(
  rules: CRRule[],
  options: CROptions = {},
) {
  const cache = new Map<string, string>([])

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
    let index = 0

    for (const className of classNames) {
      const cacheValue = cache.get(className)

      if (!options.debug && cacheValue) {
        temp.set(cacheValue, className)
        continue
      }

      let groupKey = className

      handlers.some((handler) => {
        const key = handler(className)

        if (key) {
          groupKey = key
          return true
        }

        return false
      })

      if (options.debug)
        temp.set(`[${index++}]${groupKey}`, groupKey)
      else
        temp.set(groupKey, className)

      cache.set(className, groupKey)
    }

    return Array.from(temp.values()).join(' ')
  }
}

export function transformInputRule(rule: RegExp) {
  const source = rule.source.replace(/^\^|\$$/g, '')
  return new RegExp(`^(.+?[:-])${source}$`)
}

export function parseInput(rule: RegExp, className: string) {
  if (rule.test(className)) {
    const matched = className.match(rule)!
    const [rawInput, ...matchArray] = matched

    return {
      rawInput,
      rawVariant: '',
      input: rawInput,
      matchArray,
    }
  }

  const matcher = transformInputRule(rule)

  if (matcher.test(className)) {
    const matched = className.match(matcher)!
    const [rawInput, rawVariant, ...matchArray] = matched
    const input = rawInput.slice(rawVariant.length)

    return {
      rawInput,
      rawVariant,
      input,
      matchArray,
    }
  }

  return null
}
