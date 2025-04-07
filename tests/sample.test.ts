
import { describe, expect, test } from 'vitest'

describe('Tests de base', () => {
  test('Addition simple', () => {
    expect(2 + 2).toBe(4)
  })

  test('Chaînes de caractères', () => {
    expect('hello').toContain('ello')
  })

  test('Valeurs booléennes', () => {
    expect(true).toBeTruthy()
    expect(false).toBeFalsy()
  })
})

describe('Tests asynchrones', () => {
  test('Promesse résolue', async () => {
    const data = await Promise.resolve('données')
    expect(data).toBe('données')
  })
})
