import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('string or strings', () => {
    expect(cx('')).toMatchInlineSnapshot(`""`)
    expect(cx('a')).toMatchInlineSnapshot(`"a"`)
    expect(cx('a', 'b')).toMatchInlineSnapshot(`"a b"`)
    expect(cx(['a'], ['b'])).toMatchInlineSnapshot(`"a b"`)
  })

  it('number or numbers', () => {
    expect(cx(0)).toMatchInlineSnapshot(`""`)
    expect(cx(0, 1, 2)).toMatchInlineSnapshot(`"1 2"`)
    expect(cx('a', 0, 1, 2)).toMatchInlineSnapshot(`"a 1 2"`)
  })

  it('object or objects', () => {
    expect(cx({})).toMatchInlineSnapshot(`""`)
    expect(cx({ a: false, b: undefined, c: null, d: 0 })).toMatchInlineSnapshot(`""`)
    expect(cx({ a: true, b: 1, c: [], d: {} })).toMatchInlineSnapshot(`"a b c d"`)
    expect(cx(true && 'a', false && 'b')).toMatchInlineSnapshot(`"a"`)
  })

  it('array or arrays', () => {
    expect(cx([])).toMatchInlineSnapshot(`""`)
    expect(cx([false, null, undefined, 0])).toMatchInlineSnapshot(`""`)
    expect(cx([true && 'a', { b: true, c: 1 }, [{ d: {}, e: [] }]])).toMatchInlineSnapshot(`"a b c d e"`)
  })

  it('should ignore falsy value', () => {
    expect(cx('a', null, undefined, false, '', 0, 0n, 0x0, 'b')).toMatchInlineSnapshot(`"a b"`)
  })
})
