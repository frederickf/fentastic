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

const halfMoveName = 'Halfmove clock'

export const validateHalfMoveClock = (field: Field): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(
        `${fullMoveName}: Expected "0-9", instead found "" at ${field.delimeter.position}`,
        field.delimeter.position
      )
    }
    const tokens: Token[] = validate(field.tokens, halfMoveName)
    const fieldValue = Number(field.value)
    if (fieldValue > 100) {
      throw new ParseError(
        `${halfMoveName}: Field can't exceed "100". Instead found "${field.value}" at ${tokens[0].position}`,
        tokens[0].position
      )
    }
  } catch (e) {
    if (e instanceof ParseError) {
      field.error = e
    }
    else {
      throw e
    }
  }
  
  return field
}

export const parseHalfMoveClock = (field: Field): number => Number(field.value)


const fullMoveName = 'Fullmove number'

export const validateFullMoveNumber = (field: Field): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(
        `${fullMoveName}: Expected "1-9", instead found "" at ${field.delimeter.position}`,
        field.delimeter.position
      )
    }

    if (field.tokens[0].value === '0') {
      throw new ParseError(
        `${fullMoveName}: Expected "1-9", instead found "0" at ${field.tokens[0].position}`,
        field.tokens[0].position
        )
    }
    validate(field.tokens, fullMoveName)
  } catch (e) {
    if (e instanceof ParseError) {
      field.error = e
    }
    else {
      throw e
    }
  }
  return field
}

export const parseFullMoveNumber = (field: Field): number => Number(field.value)