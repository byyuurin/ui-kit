import type { ClassValue } from './types'

const separator = ' '

function toValueString(value: ClassValue): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint')
    return value.toString()

  if (typeof value === 'object') {
    if (Array.isArray(value))
      return value.filter(Boolean).map((v) => toValueString(v)).join(separator)

    let result = ''

    for (const k in value) {
      if (value[k]) {
        result += k && result ? separator : ''
        result += k
      }
    }

    return result
  }

  return ''
}

export function cx(...values: ClassValue[]): string {
  let result = ''

  for (const value of values) {
    if (value) {
      const s = toValueString(value)

      result += s && result ? separator : ''
      result += s
    }
  }

  return result
}
