import { Token } from './createTokens.js'

export const validate = (field: Token[]) => {
  if (field.length !== 1) {
    throw new Error(`sideToMove contains too many characters. Found ${field.length}; expected 1`)
  }

  if (field[0].value !== 'w' && field[0].value !== 'b') {
    throw new Error(`Expected "w|b", instead found ${field[0].value} at ${field[0].position}`)
  }

  return field
}

export const parseSideToMove = (field: Token[]) => {
  const validField = validate(field)
  const token = validField[0]
  if (token.value === 'w') {
    return 'white'
  }
  else {
    return 'black'
  }
}
