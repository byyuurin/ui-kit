import type { ClassValue } from './types'

const separator = ' '

export function cx(...values: ClassValue[]): string {
  let result = ''
  let hasContent = false

  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < values.length; i++) {
    const value = values[i]

    if (typeof value === 'boolean' || value == null || value === 0 || value === 0n)
      continue

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      const str = String(value).trim()

      if (str) {
        if (hasContent)
          result += separator

        result += str
        hasContent = true
      }

      continue
    }

    if (Array.isArray(value)) {
      const innerResult = cx(...value)

      if (innerResult) {
        if (hasContent)
          result += separator

        result += innerResult
        hasContent = true
      }

      continue
    }

    for (const key in value) {
      if (value[key] && typeof key === 'string' && key) {
        if (hasContent)
          result += separator

        result += key
        hasContent = true
      }
    }
  }

  return result
}
