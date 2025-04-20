/* utils
---------------------------------------- */
type DepthLimit = [1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
type DepthReduce<N extends number> = N extends keyof DepthLimit ? DepthLimit[N] : 0

export type FlatObjectPath<
  T,
  ParentPath extends string = '',
  Depth extends number = 5,
> = Depth extends 0
  ? never
  : T extends Record<string, any>
    ? {
        [TK in keyof T]: T[TK] extends Record<string, any>
          ? FlatObjectPath<T[TK], ParentPath extends '' ? TK & string : `${ParentPath}.${TK & string}`, DepthReduce<Depth>>
          : ParentPath extends '' ? TK & string : `${ParentPath}.${TK & string}`
      }[keyof T]
    : never

export type MaybeArray<T> = T | T[]

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
export type ClassValue = MaybeArray<Record<string, any> | string | number | bigint | boolean | null | undefined>

export type ClassProp<V = ClassValue> =
  | { class?: V, className?: never }
  | { class?: never, className?: V }

export type VariantProps<T> = T extends CVReturnType<infer V, infer P, ClassValue>
  ? CVDefaultVariants<V, P>
  : T extends CVScope<infer V, any, any, ClassValue, infer P>
    ? CVDefaultVariants<V, P>
    : never

/* CV types
---------------------------------------- */
export type CVParts = Record<string, ClassValue> | undefined

type PartsName<P extends CVParts, B extends ClassValue> = B extends undefined
  ? keyof P
  : keyof P | 'base'

type PartsClassValue<S extends CVParts, B extends ClassValue> = {
  [K in PartsName<S, B>]?: ClassValue;
}

export type CVVariantsDefault<
  P extends CVParts,
  B extends ClassValue,
> = P extends undefined
  ? {}
  : {
      [variantName: string]: {
        [variantValue: string]: P extends CVParts
          ? PartsClassValue<P, B> | null | ''
          : ClassValue
      }
    }

export type CVVariants<
  P extends CVParts,
  B extends ClassValue | undefined = undefined,
> = CVVariantsDefault<P, B>

export type CVCompoundVariants<
  V extends CVVariants<P>,
  P extends CVParts,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V]?: MaybeArray<StringToBoolean<keyof V[K]>>
  } & (
    P extends undefined
      ? ClassProp<PartsClassValue<P, B> | ClassValue>
      : ClassProp<PartsClassValue<P, B>>
  )
>

export type CVDefaultVariants<
  V extends CVVariants<P>,
  P extends CVParts,
> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]>
}

export type CVProps<
  V extends CVVariants<P>,
  P extends CVParts,
> = [keyof V] extends string[]
  ? { [K in keyof V]?: StringToBoolean<keyof V[K]> } & ClassProp
  : ClassProp

export type CVHandler<
  V extends CVVariants<P>,
  P extends CVParts,
  T = string,
> = (props?: CVProps<V, P>) => T

export interface CVReturnType<
  V extends CVVariants<P>,
  P extends CVParts,
  B extends ClassValue,
> {
  (props?: CVProps<V, P>): P extends undefined
    ? { [K in PartsName<{}, B>]: CVHandler<V, P> }
    : { [K in keyof P | PartsName<{}, B>]: CVHandler<V, P> }
}

export interface CVScope<
  V extends CVVariants<P, B>,
  CV extends CVCompoundVariants<V, P, B>,
  DV extends CVDefaultVariants<V, P>,
  B extends ClassValue = undefined,
  P extends CVParts = undefined,
> {
  /** Base allows you to set a base class for a component. */
  base?: B
  /** Parts allow you to separate a component into multiple parts. */
  parts?: P
  /** Variants allow you to create multiple versions of the same component. */
  variants?: V
  /** Compound variants allow you to apply classes to multiple variants at once. */
  compoundVariants?: CV
  /** Default variants allow you to set default variants for a component. */
  defaultVariants?: DV
}

export type CVScopeMeta<
  V extends CVVariants<P, B>,
  CV extends CVCompoundVariants<V, P, B>,
  DV extends CVDefaultVariants<V, P>,
  B extends ClassValue = undefined,
  P extends CVParts = undefined,
> = (
  B extends MaybeArray<string>
    ? { base: B extends any[] ? string[] : string }
    : { base: undefined }
) & {
  parts: P
  variants: V
  compoundVariants: CV
  defaultVariants: DV
}

export interface CVHandlerContext<
  V extends CVVariants<P, B> = any,
  P extends CVParts = CVParts,
  B extends ClassValue = ClassValue,
> {
  parts: B extends undefined
    ? P
    : P & { base: B extends any[] ? string[] : string }
  variants: V
  defaultVariants: CVDefaultVariants<V, P>
  compoundVariants: CVCompoundVariants<V, P, B>
  props?: (CVProps<V, P> & Record<string, unknown>) | null
  propsOverrides?: (CVProps<V, P> & Record<string, unknown>) | null
  merge: (...classes: ClassValue[]) => string
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

/* i18n types
---------------------------------------- */
export type LocaleDirection = 'ltr' | 'rtl'

export interface Locale<M> {
  name: string
  code: string
  /** @default "ltr" */
  dir?: LocaleDirection
  messages: M
}

export type TranslatorOptions = Record<string, string | number>
export type Translator<M = Record<string, string>> = (path: FlatObjectPath<M> | (string & {}), options?: TranslatorOptions) => string
