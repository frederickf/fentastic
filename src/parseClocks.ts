import { isDigit } from './tokenTypes.js'
import { Token } from './createTokens.js'

const validate = (tokens: Token[]): Token[] => {
  for (let token of tokens) {
    if (!isDigit(token.type)) {
      throw new Error(`Expected "0-9", instead found "${token.value}" at ${token.position}`)
    }
  }
  return tokens
}

const concatClockValues = (tokens: Token[]): number => {
  let value = ''
  for (let token of tokens) {
    if (isDigit(token.type)) {
      value = `${value}${token.value}`
    }
    else {
      throw new Error(`Expected "0-9", instead found "${token.value}" at ${token.position}`)
    }
  }
  return Number(value)
}

export const parseHalfMoveClock = (field: Token[]): number => {
  const tokens = validate(field)
  const halfMoveClock = concatClockValues(tokens)
  if (halfMoveClock > 100) {
    throw new Error(`Half move clock can't exceed 100. Instead found ${halfMoveClock} at ${tokens[0].position} `)
  }
  return halfMoveClock
}

export const parseFullMoveClock = (field: Token[]): number => {
  if (field[0].value === '0' || !isDigit(field[0].type)) {
    throw new Error(`Expected "1-9", instead found "${field[0].value}" at ${field[0].position}`)
  }
  const tokens = validate(field)
  return concatClockValues(tokens)
}