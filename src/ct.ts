import type {
  ClassValue,
  CVCompoundVariants,
  CVDefaultVariants,
  CVParts,
  CVScope,
  CVScopeMeta,
  CVVariants,
} from './types'

export function ct<
  V extends CVVariants<P, B>,
  CV extends CVCompoundVariants<V, P, B>,
  DV extends CVDefaultVariants<V, P>,
  B extends ClassValue = undefined,
  P extends CVParts = undefined,
>(scope: CVScope<V, CV, DV, B, P>) {
  const { base, parts, variants, compoundVariants, defaultVariants } = scope

  return Object.fromEntries(
    Object.entries({ base, parts, variants, compoundVariants, defaultVariants }).filter(([, v]) => !!v),
  ) as unknown as CVScopeMeta<V, CV, DV, B, P>
}
