import type { CRRule, CRRuleContext } from './types'

interface CROptions {
  debug?: boolean | 'all'
}

export function createCR(
  rules: CRRule[],
  options: CROptions = {},
) {
  const tokens = new Map<string, string>([])
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

      if (data && tokens.has(data.input))
        return resolve(data, tokens.get(data.input)!)

      if (data) {
        const { matchArray, ...context } = data
        const value = handler(matchArray, context)

        if (typeof value === 'string') {
          tokens.set(context.input, value)
          return resolve(context, value)
        }
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

      let isValidGroupKey = false
      let groupKey = className

      handlers.some((handler) => {
        const key = handler(className)

        if (key) {
          groupKey = key
          isValidGroupKey = true
          return true
        }

        return false
      })

      if (options.debug) {
        const debugInfo = isValidGroupKey ? groupKey : 'unknown'
        temp.set(`[${index++}]${groupKey}`, options.debug === 'all' ? `[${className}]${debugInfo}` : debugInfo)
      }
      else {
        temp.set(groupKey, className)
      }

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
