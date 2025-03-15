/* eslint-disable unicorn/no-useless-undefined */
import { describe, expect, it } from 'vitest'
import { compare, get, omit, pick, set } from './utils'

describe('utils', () => {
  const example = {
    0: 'zero',
    1: 'one',
    3: [[1, 2], [3], [4, 5]],
    foo: 'Foo',
    bar: [1, 2, 3, 4],
    nested: {
      a: {
        b: {
          c: 'true',
        },
      },
    },
  }

  describe('pick', () => {
    it('Should get a object with pick keys', () => {
      expect(pick(example, [1, 'bar'])).toMatchInlineSnapshot(`
        {
          "1": "one",
          "bar": [
            1,
            2,
            3,
            4,
          ],
        }
      `)
    })
  })

  describe('omit', () => {
    it('Should get a object without omit keys', () => {
      expect(omit(example, [3, 'bar'])).toMatchInlineSnapshot(`
        {
          "0": "zero",
          "1": "one",
          "foo": "Foo",
          "nested": {
            "a": {
              "b": {
                "c": "true",
              },
            },
          },
        }
      `)
    })
  })

  describe('get', () => {
    it('Should get values by key', () => {
      expect(get(example, 'foo')).toMatchInlineSnapshot(`"Foo"`)

      expect(get(example, [3])).toMatchInlineSnapshot(`
        [
          [
            1,
            2,
          ],
          [
            3,
          ],
          [
            4,
            5,
          ],
        ]
      `)
    })

    it('Should get values of nested key', () => {
      expect(get(example, 'nested.a.b.c')).toMatchInlineSnapshot(`"true"`)

      expect(get(example, [3, 0, 0])).toMatchInlineSnapshot(`1`)
    })
  })

  describe('set', () => {
    it('Should change value by key', () => {
      set(example, 'foo', 'Hello')
      expect(example.foo).toMatchInlineSnapshot(`"Hello"`)

      set(example, [3, 0, 0], 9)
      expect(example[3][0][0]).toMatchInlineSnapshot(`9`)
    })

    it('Should add new property', () => {
      const example2 = {}

      set(example2, 'extra', 999)

      expect(example2).toMatchInlineSnapshot(`
        {
          "extra": 999,
        }
      `)
    })
  })

  describe('compare', () => {
    it('Should return true', () => {
      expect(compare(0, 0)).toMatchInlineSnapshot(`true`)
      expect(compare('foo', 'foo')).toMatchInlineSnapshot(`true`)
      expect(compare(null, null)).toMatchInlineSnapshot(`true`)

      expect(compare({ foo: 'foo', bar: 'Bar' }, { foo: 'foo', bar: 'Bar' })).toMatchInlineSnapshot(`true`)

      expect(compare({ foo: 'Foo', bar: 'Bar' }, { bar: 'Bar', foo: 'foo' }, 'bar')).toMatchInlineSnapshot(`true`)

      expect(compare({ foo: 'Foo', bar: 'Bar' }, { bar: 'Bar', foo: 'foo' }, (a, b) => a.bar === b.bar)).toMatchInlineSnapshot(`true`)
    })

    it('Should return false', () => {
      expect(compare('0', '1')).toMatchInlineSnapshot(`false`)
      expect(compare(undefined, undefined)).toMatchInlineSnapshot(`false`)
      expect(compare(null, undefined)).toMatchInlineSnapshot(`false`)

      expect(compare({ foo: 'Foo', bar: 'Bar' }, { bar: 'Bar', foo: 'foo' })).toMatchInlineSnapshot(`false`)

      expect(compare({ foo: 'Foo', bar: 'Bar' }, { bar: 'Bar', foo: 'foo' }, 'foo')).toMatchInlineSnapshot(`false`)

      expect(compare({ foo: 'Foo', bar: 'Bar' }, { bar: 'Bar', foo: 'foo' }, (a, b) => a.foo === b.foo)).toMatchInlineSnapshot(`false`)
    })
  })
})
