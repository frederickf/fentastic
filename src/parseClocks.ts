import { type Token, isDigit} from './token.js'
import { ParseError } from './ParseError.js'
import { Field } from './createFields.js'

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

export const parseHalfMoveClock = (field: Field): number => {
  const tokens = validate(field.tokens, halfMoveName)
  const fieldValue = Number(field.value)
  if (fieldValue > 100) {
    throw new ParseError(
      `${halfMoveName}: Field can't exceed "100". Instead found "${field.value}" at ${tokens[0].position}`,
      tokens[0].position
    )
  }
  return fieldValue
}

export const parseFullMoveNumber = (field: Field): number => {
  if (field.tokens[0].value === '0' || !isDigit(field.tokens[0])) {
    throw new ParseError(
      `${fullMoveName}: Expected "1-9", instead found "${field.tokens[0].value}" at ${field.tokens[0].position}`,
      field.tokens[0].position
      )
  }
  validate(field.tokens, fullMoveName)
  return Number(field.value)
}