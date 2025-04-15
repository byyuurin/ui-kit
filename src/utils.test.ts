import { describe, expect, it } from 'vitest'
import { get, omit, pick, set } from './utils'

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
})
