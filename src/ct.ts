import type {
  ClassValue,
  CTMeta,
  CTReturn,
  CVCompoundVariants,
  CVDefaultVariants,
  CVSlots,
  CVVariants,
} from './types'

export function ct<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  DV extends CVDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
>(meta: CTMeta<V, CV, DV, B, S>) {
  const validKeys = new Set<keyof CTMeta<V, CV, DV, B, S>>(['base', 'slots', 'variants', 'compoundVariants'])
  const result = Object.fromEntries(Object.entries(meta).filter(([k, v]) => validKeys.has(k as any) && !!v))
  return result as unknown as CTReturn<V, CV, B, S>
}
