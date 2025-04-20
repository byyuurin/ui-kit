import type {
  ClassValue,
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
  return meta
}
