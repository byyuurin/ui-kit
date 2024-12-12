/* eslint-disable ts/no-empty-object-type */

import type { ClassValue } from 'clsx'

export { ClassValue }

/* utils
---------------------------------------- */
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

/* types
---------------------------------------- */
export type ClassProp<V = ClassValue> =
  | { class?: V, className?: never }
  | { class?: never, className?: V }

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
          ? SlotsClassValue<S, B> | ClassValue
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
    [K in keyof V]?:
      | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
      | (K extends keyof V ? StringToBoolean<keyof V[K]>[] : never)
  } & (
    B extends undefined
      ? ClassProp<SlotsClassValue<S, B>>
      : ClassProp<SlotsClassValue<S, B> | ClassValue>
  )
>

export type CVDefaultVariants<
  V extends CVVariants<S>,
  S extends CVSlots,
> = {
  [K in keyof V]?: K extends keyof V
    ? StringToBoolean<keyof V[K]>
    : never
}

export type CVProps<
  V extends CVVariants<S>,
  S extends CVSlots,
> = V extends undefined
  ? ClassProp
  : { [K in keyof V]?: StringToBoolean<keyof V[K]> | undefined } & ClassProp

export interface CVReturnProps<
  V extends CVVariants<S>,
  S extends CVSlots,
  B extends ClassValue,
> {
  theme: Simplify<{
    base: B
    slots: B extends undefined ? S : S & { base: string }
    variants: V
    defaultVariants: CVDefaultVariants<V, S>
    compoundVariants: CVCompoundVariants<V, S, B>
  }>
}

export type CVHandler<
  V extends CVVariants<S>,
  S extends CVSlots,
  T = string,
> = (props?: CVProps<V, S>) => T

export type CVReturnType<
  V extends CVVariants<S>,
  S extends CVSlots,
  B extends ClassValue,
> = {
  (props?: CVProps<V, S>): S extends undefined
    ? string
    : { [K in keyof S | SlotsName<{}, B>]: CVHandler<V, S> }
} & CVReturnProps<V, S, B>

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

export type CVHandlerContext<
  V extends CVVariants<S, B> = any,
  S extends CVSlots = CVSlots,
  B extends ClassValue = ClassValue,
> = Omit<CVReturnProps<V, S, B>['theme'], 'base'> & {
  slotProps?: (CVProps<V, S> & Record<string, unknown>) | null
  props?: (CVProps<V, S> & Record<string, unknown>) | null
}
