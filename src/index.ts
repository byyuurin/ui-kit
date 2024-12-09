import { clsx } from 'clsx'
import type {
  ClassValue,
  CPCompoundVariants,
  CPDefaultVariants,
  CPHandler,
  CPHandlerContext,
  CPMeta,
  CPOptions,
  CPProps,
  CPReturnType,
  CPSlots,
  CPVariants,
} from './types'
import { falsyToString, isEmptyObject } from './utils'

export * from './types'

export { clsx }

export function cp<
  V extends CPVariants<S, B>,
  CV extends CPCompoundVariants<V, S, B>,
  DV extends CPDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CPSlots = undefined,
>(
  meta: CPMeta<V, CV, DV, B, S> = {},
  options: CPOptions = {},
): CPReturnType<V, S, B> {
  const {
    base,
    slots: slotsRaw = {},
    variants = {},
    compoundVariants = [] as unknown as CV,
    defaultVariants = {},
  } = meta

  const {
    mergeClasses = clsx,
  } = options

  const slots: NonNullable<CPSlots> = isEmptyObject(slotsRaw)
    ? {}
    : { base, ...slotsRaw }

  const context: CPHandlerContext = {
    slots,
    variants,
    // @ts-expect-error missing types
    compoundVariants,
    defaultVariants,
  }

  const handler = createHandler({
    ...context,
    mergeClasses,
    base,
    slotsRaw,
  })

  const component = handler as unknown as CPReturnType<V, S, B>

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
  context: CPHandlerContext & {
    mergeClasses: (...classes: ClassValue[]) => string
    base: ClassValue
    slotsRaw: CPSlots
  },
) {
  const {
    mergeClasses,
    base,
    variants,
    compoundVariants,
    slots,
    slotsRaw,
  } = context

  const handler: CPHandler<Record<string, any>, any, unknown> = (props) => {
    if (isEmptyObject(variants) && isEmptyObject(slots))
      return mergeClasses(base, props?.class, props?.className)

    if (compoundVariants && !Array.isArray(compoundVariants))
      throw new Error(`The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`)

    const nonUndefinedProps: Record<string, unknown> = {}

    for (const prop in props) {
      if (props[prop] !== undefined)
        nonUndefinedProps[prop] = props[prop]
    }

    // with slots
    if (!isEmptyObject(slotsRaw)) {
      const slotsHandlers: Record<string, CPHandler<any, any>> = {}

      if (typeof slots === 'object' && !isEmptyObject(slots)) {
        for (const slotName of Object.keys(slots)) {
          slotsHandlers[slotName] = (slotProps) => {
            return mergeClasses(
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
    return mergeClasses(
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
  context: CPHandlerContext & { vk: string },
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
  context: CPHandlerContext & { slotName?: string },
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
  context: CPHandlerContext & {
    mergeClasses: (...classes: ClassValue[]) => string
    slotName?: string
  },
) {
  const {
    mergeClasses,
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

  const getCompleteProps = (key: string, slotProps: CPProps<any, any>) => {
    const _props = props as unknown as Record<string, any>
    const initialProp = typeof _props?.[key] === 'object'
      ? { [key]: _props[key] }
      : {}
    const result: Record<string, any> = {
      ...defaultVariants,
      ...nonUndefinedProps,
      ...initialProp,
      ...slotProps,
    }

    return result
  }

  const compoundClassNames: any[] = []

  for (const { class: cpClass, className: cpClassName, ...variantOptions } of compoundVariants) {
    let isValid = true

    for (const [key, value] of Object.entries(variantOptions)) {
      const completePropsValue = getCompleteProps(key, slotProps as any)[key]

      if (Array.isArray(value)) {
        if (!value.includes(completePropsValue as string)) {
          isValid = false
          break
        }
      }
      else {
        const isBlankOrFalse = (v: any) => v == null || v === false

        if (isBlankOrFalse(value) && isBlankOrFalse(completePropsValue))
          continue

        if (completePropsValue !== value) {
          isValid = false
          break
        }
      }
    }

    if (isValid) {
      cpClass && compoundClassNames.push(cpClass)
      cpClassName && compoundClassNames.push(cpClassName)
    }
  }

  if (!slotName || !Array.isArray(compoundClassNames))
    return compoundClassNames

  const result: Record<string, ClassValue> = {}

  for (const className of compoundClassNames) {
    if (typeof className === 'string')
      result.base = mergeClasses(result.base, className)

    if (typeof className === 'object') {
      for (const [slot, slotClassName] of Object.entries(className as Record<string, ClassValue>))
        result[slot] = mergeClasses(result[slot], slotClassName)
    }
  }

  return result[slotName]
}
