import { type Token, tokenIs } from './token.js'
import { ParseError } from './ParseError.js'
import { Field } from './createFields.js'

const isPositive = tokenIs(/[1-9]/)
const isNonNegative = tokenIs(/[\d]/)

const validate = (tokens: Token[], fieldName: string): Token[] => {
  for (const token of tokens) {
    if (!isNonNegative(token)) {
      throw new ParseError(fieldName, token.value, token.index, '0-9')
    }
  }
  return tokens
}

const halfMoveName = 'Halfmove clock'

export const validateHalfMoveClock = (field: Field): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(halfMoveName, '', field.delimiter.index, '0-9')
    }
    const tokens: Token[] = validate(field.tokens, halfMoveName)
    const fieldValue = Number(field.value)
    if (fieldValue > 100) {
      throw new ParseError(halfMoveName, field.value, tokens[0].index, '100', 'field to not exceed')
    }
  }
  catch (e) {
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
      throw new ParseError(fullMoveName, '', field.delimiter.index, '1-9')
    }

    if (!isPositive(field.tokens[0])) {
      throw new ParseError(fullMoveName, field.tokens[0].value, field.tokens[0].index, '1-9')
    }

    validate(field.tokens.slice(1), fullMoveName)
  }
  catch (e) {
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