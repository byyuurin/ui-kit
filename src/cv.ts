import { cr } from './cr'
import { cx } from './cx'
import type {
  ClassValue,
  CRRule,
  CVCompoundVariants,
  CVDefaultVariants,
  CVHandler,
  CVHandlerContext,
  CVMeta,
  CVReturnType,
  CVSlots,
  CVVariants,
} from './types'
import { falsyToString, isEmptyObject } from './utils'

export function cv(rules: CRRule[] = []) {
  const crMerge = rules.length > 0 ? cr(rules) : null

  const merge = (...classes: ClassValue[]): string => {
    const merged = cx(...classes)
    return crMerge ? crMerge(merged) : merged
  }

  return <
    V extends CVVariants<S, B>,
    CV extends CVCompoundVariants<V, S, B>,
    DV extends CVDefaultVariants<V, S>,
    B extends ClassValue = undefined,
    S extends CVSlots = undefined,
  >(
    meta: CVMeta<V, CV, DV, B, S> = {},
  ): CVReturnType<V, S, B> => {
    const {
      base,
      slots: slotsRaw = {},
      variants = {},
      compoundVariants = [] as unknown as CV,
      defaultVariants = {},
    } = meta

    const slots: NonNullable<CVSlots> = isEmptyObject(slotsRaw)
      ? {}
      : { ...slotsRaw, base: [base, slotsRaw.base] }

    const context: CVHandlerContext = {
      slots,
      variants,
      compoundVariants: compoundVariants as any,
      defaultVariants,
      merge,
    }

    const handler = createHandler({
      ...context,
      base,
      slotsRaw,
    })

    return handler as unknown as CVReturnType<V, S, B>
  }
}

function createHandler(
  context: CVHandlerContext & {
    base: ClassValue
    slotsRaw: CVSlots
  },
) {
  const {
    base,
    variants,
    compoundVariants,
    slots,
    slotsRaw,
    merge,
  } = context

  const handler: CVHandler<Record<string, any>, any, unknown> = (props) => {
    if (isEmptyObject(variants) && isEmptyObject(slots))
      return merge(base, props?.class, props?.className)

    if (compoundVariants && !Array.isArray(compoundVariants))
      throw new Error(`The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`)

    const nonUndefinedProps: Record<string, unknown> = {}

    for (const prop in props) {
      if (props[prop] !== undefined)
        nonUndefinedProps[prop] = props[prop]
    }

    // with slots
    if (!isEmptyObject(slotsRaw)) {
      const slotsHandlers: Record<string, CVHandler<Record<string, any>, any>> = {}

      if (typeof slots === 'object' && !isEmptyObject(slots)) {
        for (const slotName of Object.keys(slots)) {
          slotsHandlers[slotName] = (slotProps) => {
            return merge(
              slots[slotName],
              getVariantClassValue({
                ...context,
                props,
                slotName,
                slotProps,
              }),
              getCompoundVariantClassValue({
                ...context,
                props,
                slotName,
                slotProps,
              }),
              ...slotName === 'base' ? [props?.class, props?.className] : [],
              slotProps?.class,
              slotProps?.className,
            )
          }
        }

        return slotsHandlers
      }
    }

    // normal variants
    return {
      base: (slotProps) => {
        return merge(
          base,
          getVariantClassValue({
            ...context,
            props: { ...props, ...slotProps } as any,
          }),
          getCompoundVariantClassValue({
            ...context,
            props: { ...props, ...slotProps } as any,
          }),
          props?.class,
          props?.className,
          slotProps?.class,
          slotProps?.className,
        )
      },
    } satisfies Record<'base', CVHandler<Record<string, any>, any>>
  }

  return handler
}

function getVariantValue(
  context: CVHandlerContext & { vk: string },
) {
  const {
    vk,
    variants,
    defaultVariants,
    slotProps = null,
    props = null,
  } = context

  const variantConfig = variants[vk]

  if (!variantConfig || isEmptyObject(variantConfig))
    return null

  const variantProp = slotProps?.[vk] ?? props?.[vk]

  if (variantProp === null)
    return null

  const variantKey = falsyToString(variantProp)
  const defaultVariantProp = defaultVariants?.[vk]

  const key = variantKey != null && typeof variantKey != 'object'
    ? variantKey
    : falsyToString(defaultVariantProp)

  return variantConfig[key || 'false'] as ClassValue
}

function getVariantClassValue(
  context: CVHandlerContext & { slotName?: string },
) {
  const { slotName, variants } = context

  if (!variants)
    return null

  if (!slotName) {
    const result = Object.keys(variants).map((vk) => getVariantValue({ vk, ...context }))
    return result
  }

  if (typeof variants !== 'object')
    return null

  const values: ClassValue[] = []

  for (const vk in variants) {
    const variantValue = getVariantValue({ vk, ...context })

    const value
      = slotName === 'base' && typeof variantValue === 'string'
        ? variantValue
        : variantValue && (variantValue as any)[slotName]

    if (value)
      values.push(value)
  }

  return values
}

function getCompoundVariantClassValue(
  context: CVHandlerContext & { slotName?: string },
) {
  const {
    compoundVariants,
    defaultVariants,
    slotProps = null,
    props = null,
    slotName,
  } = context

  const nonUndefinedProps: Record<string, unknown> = {}

  for (const prop in props) {
    if (props[prop] !== undefined)
      nonUndefinedProps[prop] = props[prop]
  }

  const getCompleteProps = (slotProps: Record<string, any>) => ({
    ...defaultVariants,
    ...nonUndefinedProps,
    ...slotProps,
  })

  const compoundClassNames: any[] = []

  for (const variant of compoundVariants) {
    const {
      class: $class,
      className: $className,
      ...variantOptions
    } = variant

    let isValid = true

    for (const [key, value] of Object.entries(variantOptions)) {
      const completePropsValue = getCompleteProps(slotProps ?? {})[key]

      if (Array.isArray(value)) {
        if (!value.includes(completePropsValue as string)) {
          isValid = false
          break
        }
      }
      else {
        const isBlankOrFalse = (v: unknown) => v == null || v === false

        if (isBlankOrFalse(value) && isBlankOrFalse(completePropsValue))
          continue

        if (completePropsValue !== value) {
          isValid = false
          break
        }
      }
    }

    if (isValid) {
      $class && compoundClassNames.push($class)
      $className && compoundClassNames.push($className)
    }
  }

  if (!slotName || !Array.isArray(compoundClassNames))
    return compoundClassNames

  const result: Record<string, ClassValue> = {}

  for (const className of compoundClassNames) {
    if (typeof className === 'string')
      result.base = cx(result.base, className)

    if (typeof className === 'object') {
      for (const [slot, slotClassName] of Object.entries(className as Record<string, ClassValue>))
        result[slot] = cx(result[slot], slotClassName)
    }
  }

  return result[slotName]
}
