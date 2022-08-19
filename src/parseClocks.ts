import { type Token, isDigit} from './token.js'
import { ParseError } from './ParseError.js'

const validate = (tokens: Token[], fieldName: string): Token[] => {
  for (let token of tokens) {
    if (!isDigit(token)) {
      throw new ParseError(
        `${fieldName}: Expected "0-9", instead found "${token.value}" at ${token.position}`,
        token.position
      )
    }
  }
  return tokens
}

const concatClockValues = (tokens: Token[], fieldName: string): number => {
  let value = ''
  for (let token of tokens) {
    if (isDigit(token)) {
      value = `${value}${token.value}`
    }
    else {
      throw new ParseError(
        `${fieldName}: Expected "0-9", instead found "${token.value}" at ${token.position}`,
        token.position
      )
    }
  }
  return Number(value)
}

const halfMoveName = 'Halfmove clock'
const fullMoveName = 'Fullmove number'

export const parseHalfMoveClock = (field: Token[]): number => {
  const tokens = validate(field, halfMoveName)
  const halfMoveClock = concatClockValues(tokens, halfMoveName)
  if (halfMoveClock > 100) {
    throw new ParseError(
      `${halfMoveName}: Field can't exceed "100". Instead found "${halfMoveClock}" at ${tokens[0].position}`,
      tokens[0].position
    )
  }
  return halfMoveClock
}

export const parseFullMoveNumber = (field: Token[]): number => {
  if (field[0].value === '0' || !isDigit(field[0])) {
    throw new ParseError(
      `${fullMoveName}: Expected "1-9", instead found "${field[0].value}" at ${field[0].position}`,
      field[0].position
      )
  }
  const tokens = validate(field, fullMoveName)
  return concatClockValues(tokens, fullMoveName)
}