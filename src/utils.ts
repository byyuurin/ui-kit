export { clsx } from 'clsx'

export function isEmptyObject(obj: any) {
  return !obj || typeof obj !== 'object' || Object.keys(obj).length === 0
}

export function falsyToString(value: any) {
  return typeof value === 'boolean'
    ? `${value}`
    : value === 0
      ? '0'
      : value
}
