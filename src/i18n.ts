import type { Locale, Translator, TranslatorOptions } from './types'
import { get } from './utils'

export function defineLocale<M>(locale: Locale<M>) {
  return locale
}

export function translate<M>(locale: Locale<M>, path: string, options: TranslatorOptions = {}): string {
  const prop: string = get(locale, `messages.${path}`, path)
  return prop.replace(/\{(\w+)\}/g, (s, key) => `${options[key] ?? s}`)
}

export function createTranslator<M>(locale: Locale<M>): Translator<M> {
  locale.dir ??= 'ltr'
  return (path, options) => translate(locale, path, options)
}
