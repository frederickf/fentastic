import { sidePattern } from './patterns.js'

export const validate = field => {
  if (field.length !== 1) {
    throw new Error(`sideToMove contains too many characters. Found ${field.length}; expected 1`)
  }

  if (!field[0].value.match(sidePattern)) {
    throw new Error(`Expected "w|b", instead found ${field[0].value} at ${field[0].position}`)
  }

  return field
}

export const parseSideToMove = field => {
  const validField = validate(field)
  const token = validField[0]
  if (token.value === 'w') {
    return 'white'
  }
  else {
    return 'black'
  }
}
