import { isDigit } from './tokenTypes.js'
import { Token } from './createTokens.js'

export const parseHalfMoveClock = (field: Token[]) => {
  console.log('parseHalfMoveClock', field)
  let value = 0
  for (let token of field) {
    if (isDigit(token.type)) {
      value = value + <number>token.value
    }
    else {
      throw new Error(`Expected "0-9", instead found "${token.value}" at ${token.position}`)
    }
  }

  return value
}
