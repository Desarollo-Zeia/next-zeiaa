import { capitalizeFirstLetter, formattedDate } from '../func'

describe('Utility Functions', () => {
  describe('capitalizeFirstLetter', () => {
    it('capitalizes the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
    })

    it('handles empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A')
    })

    it('handles already capitalized string', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello')
    })

    it('handles undefined input', () => {
      expect(capitalizeFirstLetter(undefined)).toBe('')
    })
  })

  describe('formattedDate', () => {
    it('formats date correctly', () => {
      const result = formattedDate('2024-01-15')
      expect(result).toMatch(/\d+ de \w+/)
    })

    it('handles invalid date', () => {
      expect(() => formattedDate('invalid-date')).not.toThrow()
    })
  })
})