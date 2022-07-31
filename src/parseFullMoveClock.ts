
import { isDigit } from './tokenTypes.js'

export const parseFullMoveClock = field => {
  if (field[0].value === 0 || !isDigit(field[0].type)) {
    throw new Error(`Expected "1-9", instead found "${field[0].value}" at ${field[0].position}`)
  }

  let value = 0
  for (let token of field) {
    if (isDigit(token.type)) {
      value = value + token.value
    }
    else {
      throw new Error(`Expected "0-9", instead found "${token.value}" at ${token.position}`)
    }
  }

  return value
}
