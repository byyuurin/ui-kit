import type {
  ClassValue,
  CVCompoundVariants,
  CVDefaultVariants,
  CVHandler,
  CVHandlerContext,
  CVMeta,
  CVReturnType,
  CVSlots,
  CVVariants,
} from './types'
import { clsx, falsyToString, isEmptyObject } from './utils'

export function cv<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  DV extends CVDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
>(
  meta: CVMeta<V, CV, DV, B, S> = {},
): CVReturnType<V, S, B> {
  const {
    base,
    slots: slotsRaw = {},
    variants = {},
    compoundVariants = [] as unknown as CV,
    defaultVariants = {},
  } = meta

  const slots: NonNullable<CVSlots> = isEmptyObject(slotsRaw)
    ? {}
    : { base, ...slotsRaw }

  const context: CVHandlerContext = {
    slots,
    variants,
    // @ts-expect-error missing types
    compoundVariants,
    defaultVariants,
  }

  const handler = createHandler({
    ...context,
    base,
    slotsRaw,
  })

  const component = handler as unknown as CVReturnType<V, S, B>

  component.theme = {
    base,
    slots,
    variants,
    compoundVariants,
    defaultVariants,
  } as any

  return component
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
  } = context

  const handler: CVHandler<Record<string, any>, any, unknown> = (props) => {
    if (isEmptyObject(variants) && isEmptyObject(slots))
      return clsx(base, props?.class, props?.className)

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
            return clsx(
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
              props?.class,
              props?.className,
              slotProps?.class,
              slotProps?.className,
            )
          }
        }

        return slotsHandlers
      }
    }

    // normal variants
    return clsx(
      base,
      getVariantClassValue({
        ...context,
        props,
      }),
      getCompoundVariantClassValue({
        ...context,
        props,
      }),
      props?.class,
      props?.className,
    )
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
      values[values.length] = value
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
      result.base = clsx(result.base, className)

    if (typeof className === 'object') {
      for (const [slot, slotClassName] of Object.entries(className as Record<string, ClassValue>))
        result[slot] = clsx(result[slot], slotClassName)
    }
  }

  return result[slotName]
}
