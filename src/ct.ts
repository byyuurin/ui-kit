import type {
  ClassValue,
  CTReturn,
  CVCompoundVariants,
  CVDefaultVariants,
  CVMeta,
  CVSlots,
  CVVariants,
} from './types'

export function ct<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  DV extends CVDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
>(meta: CVMeta<V, CV, DV, B, S>) {
  const { base, slots, variants, compoundVariants, defaultVariants } = meta

  return Object.fromEntries(
    Object.entries({ base, slots, variants, compoundVariants, defaultVariants }).filter(([, v]) => !!v),
  ) as unknown as CTReturn<V, CV, DV, B, S>
}
