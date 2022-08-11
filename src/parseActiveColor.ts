import { type Token } from './token.js'

const fieldName = 'Active color'
export const parseActiveColor = (field: Token[]): 'white' | 'black' => {
  if (field.length !== 1) {
    throw new Error(`${fieldName}: Field contains too many characters. Expected 1; Found ${field.length} at ${field[0].position}`)
  }

  if (field[0].value !== 'w' && field[0].value !== 'b') {
    throw new Error(`${fieldName}: Expected "w|b", instead found ${field[0].value} at ${field[0].position}`)
  }

  return field[0].value === 'w' ? 'white' : 'black'
}
