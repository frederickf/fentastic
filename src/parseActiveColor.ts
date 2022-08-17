import { type Token } from './token.js'
import { ParseError } from './Errors.js'

const fieldName = 'Active color'
export const parseActiveColor = (field: Token[]): 'white' | 'black' => {
  if (field.length !== 1) {
    throw new ParseError(
      `${fieldName}: Field contains too many characters. Expected 1; Found ${field.length} at ${field[0].position}`,
      field[0].position
    )
  }

  if (field[0].value !== 'w' && field[0].value !== 'b') {
    throw new ParseError(`${fieldName}: Expected "w|b", instead found ${field[0].value} at ${field[0].position}`,
    field[0].position
  )
  }

  return field[0].value === 'w' ? 'white' : 'black'
}
