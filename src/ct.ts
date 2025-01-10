import type {
  ClassValue,
  CTMeta,
  CTReturn,
  CVCompoundVariants,
  CVSlots,
  CVVariants,
} from './types'

export function ct<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
>(meta: CTMeta<V, CV, never, B, S>) {
  const { base, slots, variants, compoundVariants } = meta
  return { base, slots, variants, compoundVariants } as unknown as CTReturn<V, CV, B, S>
}
