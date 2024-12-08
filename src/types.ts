/* eslint-disable ts/no-empty-object-type */

import type { ClassValue } from 'clsx'

export { ClassValue }

/* utils
---------------------------------------- */
export type ParseString<T, InferValue, TrueType, FalseType = string> = T extends InferValue
  ? TrueType
  : FalseType

export type StringToBoolean<T> = ParseString<T, 'true' | 'false', boolean, T>

export type Stringify<T> = T extends Record<string, unknown>
  ? { [K in keyof T as T[K] extends undefined | null ? never : K]: K extends keyof ClassProp
      ? string | string[]
      : Stringify<T[K]> }
  : T extends Array<infer V>
    ? Array<Stringify<V>>
    : T

/* types
---------------------------------------- */

export type ClassProp<V = ClassValue> =
  | { class?: V, className?: never }
  | { class?: never, className?: V }

export type CPSlots = Record<string, ClassValue> | undefined

type SlotsName<S extends CPSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | 'base'

type SlotsClassValue<S extends CPSlots, B extends ClassValue> = {
  [K in SlotsName<S, B>]?: ClassValue;
}

export type CPVariantsDefault<
  S extends CPSlots,
  B extends ClassValue,
> = S extends undefined
  ? {}
  : {
      [key: string]: {
        [key: string]: S extends CPSlots
          ? SlotsClassValue<S, B> | ClassValue
          : ClassValue
      }
    }

export type CPVariants<
  S extends CPSlots,
  B extends ClassValue | undefined = undefined,
> = CPVariantsDefault<S, B>

export type CPCompoundVariants<
  V extends CPVariants<S>,
  S extends CPSlots,
  B extends ClassValue,
> = Array<
  {
    [K in keyof V]?:
      | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
      | (K extends keyof V ? StringToBoolean<keyof V[K]>[] : never)
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
>

export type CPDefaultVariants<
  V extends CPVariants<S>,
  S extends CPSlots,
> = {
  [K in keyof V]?: K extends keyof V
    ? StringToBoolean<keyof V[K]>
    : never
}

export type CPProps<
  V extends CPVariants<S>,
  S extends CPSlots,
> = V extends undefined
  ? ClassProp
  : { [K in keyof V]?: StringToBoolean<keyof V[K]> | undefined } & ClassProp

export interface CPReturnProps<
  V extends CPVariants<S>,
  S extends CPSlots,
  B extends ClassValue,
> {
  theme: Stringify<{
    base: B
    slots: B extends undefined ? S : S & { base: string }
    variants: V
    defaultVariants: CPDefaultVariants<V, S>
    compoundVariants: CPCompoundVariants<V, S, B>
  }>
}

export type CPHandler<
  V extends CPVariants<S>,
  S extends CPSlots,
  T = string,
> = (props?: CPProps<V, S>) => T

export type CPReturnType<
  V extends CPVariants<S>,
  S extends CPSlots,
  B extends ClassValue,
> = {
  (props?: CPProps<V, S>): S extends undefined
    ? string
    : { [K in keyof S | SlotsName<{}, B>]: CPHandler<V, S> }
} & CPReturnProps<V, S, B>

export interface CPMeta<
  V extends CPVariants<S, B>,
  CV extends CPCompoundVariants<V, S, B>,
  DV extends CPDefaultVariants<V, S>,
  B extends ClassValue = undefined,
  S extends CPSlots = undefined,
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

export interface CPOptions {
  /**
   * A function to merge multiple class values into a single `className` string.
   *
   * By default, it uses
   * [`clsx`](https://github.com/lukeed/clsx) for merging.
   */
  mergeClasses?: (...classes: ClassValue[]) => string
}

export type CPHandlerContext<
  V extends CPVariants<S, B> = any,
  S extends CPSlots = CPSlots,
  B extends ClassValue = ClassValue,
> = Omit<CPReturnProps<V, S, B>['theme'], 'base'> & {
  slotProps?: (CPProps<V, S> & Record<string, unknown>) | null
  props?: (CPProps<V, S> & Record<string, unknown>) | null
}
