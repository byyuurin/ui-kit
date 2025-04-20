import { cr } from './cr'
import { cx } from './cx'
import type {
  ClassValue,
  CRRule,
  CVCompoundVariants,
  CVDefaultVariants,
  CVHandler,
  CVHandlerContext,
  CVParts,
  CVReturnType,
  CVScope,
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
    V extends CVVariants<P, B>,
    CV extends CVCompoundVariants<V, P, B>,
    DV extends CVDefaultVariants<V, P>,
    B extends ClassValue = undefined,
    P extends CVParts = undefined,
  >(
    scope: CVScope<V, CV, DV, B, P> = {},
  ): CVReturnType<V, P, B> => {
    const {
      base,
      parts: partsRaw = {},
      variants = {},
      compoundVariants = [] as unknown as CV,
      defaultVariants = {},
    } = scope

    const parts: NonNullable<CVParts> = isEmptyObject(partsRaw)
      ? {}
      : { ...partsRaw, base: [base, partsRaw.base] }

    const context: CVHandlerContext = {
      parts,
      variants,
      compoundVariants: compoundVariants as any,
      defaultVariants,
      merge,
    }

    const handler = createHandler({
      ...context,
      base,
      partsRaw,
    })

    return handler as unknown as CVReturnType<V, P, B>
  }
}

function createHandler(
  context: CVHandlerContext & {
    base: ClassValue
    partsRaw: CVParts
  },
) {
  const {
    base,
    compoundVariants,
    parts,
    partsRaw,
    merge,
  } = context

  const handler: CVHandler<Record<string, any>, any, unknown> = (props) => {
    if (compoundVariants && !Array.isArray(compoundVariants))
      throw new Error(`The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`)

    const nonUndefinedProps: Record<string, unknown> = {}

    for (const prop in props) {
      if (props[prop] !== undefined)
        nonUndefinedProps[prop] = props[prop]
    }

    // with parts
    if (!isEmptyObject(partsRaw)) {
      const partsHandlers: Record<string, CVHandler<Record<string, any>, any>> = {}

      if (typeof parts === 'object' && !isEmptyObject(parts)) {
        for (const partName of Object.keys(parts)) {
          partsHandlers[partName] = (propsOverrides) => {
            return merge(
              parts[partName],
              getVariantClassValue({
                ...context,
                props,
                partName,
                propsOverrides,
              }),
              getCompoundVariantClassValue({
                ...context,
                props,
                partName,
                propsOverrides,
              }),
              ...partName === 'base' ? [props?.class, props?.className] : [],
              propsOverrides?.class,
              propsOverrides?.className,
            )
          }
        }

        return partsHandlers
      }
    }

    // normal variants
    return {
      base: (propsOverrides) => {
        return merge(
          base,
          getVariantClassValue({
            ...context,
            props: { ...props, ...propsOverrides } as any,
          }),
          getCompoundVariantClassValue({
            ...context,
            props: { ...props, ...propsOverrides } as any,
          }),
          props?.class,
          props?.className,
          propsOverrides?.class,
          propsOverrides?.className,
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
    propsOverrides = null,
    props = null,
  } = context

  const variantConfig = variants[vk]

  if (!variantConfig || isEmptyObject(variantConfig))
    return null

  const variantProp = propsOverrides?.[vk] ?? props?.[vk]

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
  context: CVHandlerContext & { partName?: string },
) {
  const { partName, variants } = context

  if (!variants)
    return null

  if (!partName) {
    const result = Object.keys(variants).map((vk) => getVariantValue({ vk, ...context }))
    return result
  }

  if (typeof variants !== 'object')
    return null

  const values: ClassValue[] = []

  for (const vk in variants) {
    const variantValue = getVariantValue({ vk, ...context })

    const value
      = partName === 'base' && typeof variantValue === 'string'
        ? variantValue
        : variantValue && (variantValue as any)[partName]

    if (value)
      values.push(value)
  }

  return values
}

function getCompoundVariantClassValue(
  context: CVHandlerContext & { partName?: string },
) {
  const {
    compoundVariants,
    defaultVariants,
    props = null,
    propsOverrides = null,
    partName,
  } = context

  const nonUndefinedProps: Record<string, unknown> = {}

  for (const prop in props) {
    if (props[prop] !== undefined)
      nonUndefinedProps[prop] = props[prop]
  }

  const getCompleteProps = (propsOverrides: Record<string, any>) => ({
    ...defaultVariants,
    ...nonUndefinedProps,
    ...propsOverrides,
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
      const completePropsValue = getCompleteProps(propsOverrides ?? {})[key]

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

  if (!partName || !Array.isArray(compoundClassNames))
    return compoundClassNames

  const result: Record<string, ClassValue> = {}

  for (const className of compoundClassNames) {
    if (typeof className === 'string')
      result.base = cx(result.base, className)

    if (typeof className === 'object') {
      for (const [part, partClassName] of Object.entries(className as Record<string, ClassValue>))
        result[part] = cx(result[part], partClassName)
    }
  }

  return result[partName]
}
