/* eslint-disable ts/no-empty-object-type */

/* clsx types (source: https://github.com/lukeed/clsx/blob/master/clsx.d.ts)
---------------------------------------- */
type ClassDictionary = Record<string, any>
type ClassArray = ClassValue[]
export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined

/* utils
---------------------------------------- */
type MaybeArray<T> = T | T[]

export type ParseString<T, InferValue, TrueType, FalseType = string> = T extends InferValue
  ? TrueType
  : FalseType

export type StringToBoolean<T> = ParseString<T, 'true' | 'false', boolean, T>

export type Simplify<T> = T extends Record<string, unknown>
  ? { [K in keyof T as T[K] extends undefined | null ? never : K]: K extends keyof ClassProp
      ? string | string[]
      : Simplify<T[K]> }
  : T extends Array<infer V>
    ? Array<Simplify<V>>
    : T

/* base types
---------------------------------------- */
export type ClassProp<V = ClassValue> =
  | { class?: V, className?: never }
  | { class?: never, className?: V }

export type VariantProps<T> = T extends CVReturnType<infer V, infer S, ClassValue>
  ? CVDefaultVariants<V, S>
  : T extends CTReturn<infer V, any, any, ClassValue, infer S>
    ? CVDefaultVariants<V, S>
    : never

/* CV types
---------------------------------------- */
export type CVSlots = Record<string, ClassValue> | undefined

type SlotsName<S extends CVSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | 'base'

type SlotsClassValue<S extends CVSlots, B extends ClassValue> = {
  [K in SlotsName<S, B>]?: ClassValue;
}

export type CVVariantsDefault<
  S extends CVSlots,
  B extends ClassValue,
> = S extends undefined
  ? {}
  : {
      [key: string]: {
        [key: string]: S extends CVSlots
          ? SlotsClassValue<S, B> | null | ''
          : ClassValue
      }
    }

export type CVVariants<
  S extends CVSlots,
  B extends ClassValue | undefined = undefined,
> = CVVariantsDefault<S, B>

export type CVCompoundVariants<
  V extends CVVariants<S>,
  S extends CVSlots,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V]?: MaybeArray<StringToBoolean<keyof V[K]>>
  } & (
    S extends undefined
      ? ClassProp<SlotsClassValue<S, B> | ClassValue>
      : ClassProp<SlotsClassValue<S, B>>
  )
>

export type CVDefaultVariants<
  V extends CVVariants<S>,
  S extends CVSlots,
> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>
}

export type CVProps<
  V extends CVVariants<S>,
  S extends CVSlots,
> = [keyof V] extends string[]
  ? { [K in keyof V]?: StringToBoolean<keyof V[K]> } & ClassProp
  : ClassProp

export type CVHandler<
  V extends CVVariants<S>,
  S extends CVSlots,
  T = string,
> = (props?: CVProps<V, S>) => T

export interface CVReturnType<
  V extends CVVariants<S>,
  S extends CVSlots,
  B extends ClassValue,
> {
  (props?: CVProps<V, S>): S extends undefined
    ? string
    : { [K in keyof S | SlotsName<{}, B>]: CVHandler<V, S> }
}

export interface CVMeta<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  DV extends CVDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
> {
  /** Base allows you to set a base class for a component. */
  base?: B
  /** Slots allow you to separate a component into multiple parts. */
  slots?: S
  /** Variants allow you to create multiple versions of the same component. */
  variants?: V
  /** Compound variants allow you to apply classes to multiple variants at once. */
  compoundVariants?: CV
  /** Default variants allow you to set default variants for a component. */
  defaultVariants?: DV
}

export interface CVHandlerContext<
  V extends CVVariants<S, B> = any,
  S extends CVSlots = CVSlots,
  B extends ClassValue = ClassValue,
> {
  slots: B extends undefined
    ? S
    : S & { base: B extends any[] ? string[] : string }
  variants: V
  defaultVariants: CVDefaultVariants<V, S>
  compoundVariants: CVCompoundVariants<V, S, B>
  slotProps?: (CVProps<V, S> & Record<string, unknown>) | null
  props?: (CVProps<V, S> & Record<string, unknown>) | null
  merge: (...classes: ClassValue[]) => string
}

/* CT types
---------------------------------------- */
export type CTReturn<
  V extends CVVariants<S, B>,
  CV extends CVCompoundVariants<V, S, B>,
  DV extends CVDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CVSlots = undefined,
> = B extends MaybeArray<string>
  ? {
      base: B extends any[] ? string[] : string
      slots: S
      variants: V
      compoundVariants: CV
      defaultVariants: DV
    }
  : {
      base: undefined
      slots: S
      variants: V
      compoundVariants: CV
      defaultVariants: DV
    }

/* CR types
---------------------------------------- */
export interface CRRuleContext {
  /** Current selector for rule matching */
  input: string
  /** Unprocessed selector from user input. */
  rawInput: string
  /** Matched variants for this rule. */
  rawVariant?: string
}

export interface CRRuleOptions {
  /**
   * Prefix for internal group name
   *
   * @default ""
   */
  scope?: string
}

export type CRRuleMatcher = (
  matchArray: string[],
  context: Readonly<CRRuleContext>
) => string | null

export type CRRule =
  | [RegExp, CRRuleMatcher]
  | [RegExp, CRRuleMatcher, CRRuleOptions]
