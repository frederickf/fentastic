import { isDigit } from './tokenTypes.js'

export const parseHalfMoveClock = field => {
  console.log('parseHalfMoveClock', field)
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
