describe('initial', () => {
  // https://yeisondaza.com/que-son-y-como-escribir-pruebas-en-javascript
  test('first tests', () => {
    expect(true).toBe(true)
  })

  test('sum works', () => {
    const result = 3 + 4
    const expected = 7
    expect(result).toBe(expected)
  })
})