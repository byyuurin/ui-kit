import { describe, expect, it } from 'vitest'
import { createTranslator, defineLocale } from './i18n'

describe('i18n', () => {
  describe('translator', () => {
    const locale = defineLocale({
      name: 'English',
      code: 'en',
      messages: {
        carousel: {
          prev: 'Prev',
          next: 'Next',
          goto: 'Go to slide {page}',
        },
      },
    })
    const t = createTranslator(locale)

    it('Should output translated message or input text', () => {
      expect(t('carousel.next')).toMatchInlineSnapshot(`"Next"`)
      expect(t('carousel.goto')).toMatchInlineSnapshot(`"Go to slide {page}"`)
      expect(t('carousel.goto', { page: 1, pageSize: 10 })).toMatchInlineSnapshot(`"Go to slide 1"`)

      expect(t('Unknown Messages')).toMatchInlineSnapshot(`"Unknown Messages"`)
    })
  })
})
