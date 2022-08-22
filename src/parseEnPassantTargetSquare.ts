import { rankPattern, enPassantFilePattern } from './patterns.js'
import { type Token, isDash } from './token.js'
import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

const fieldName = 'En passant target square'
export const validateEnPassantTargetSquare = (field: Field ): Field => {
  try {
    if (field.tokens.length === 1) {
      if (isDash(field.tokens[0])) {
        return field
      }
      else {
        throw new ParseError(
          `${fieldName}: Expected "-", instead found "${field.value}" at ${field.tokens[0].position}`,
          field.tokens[0].position
        )
      }
    }
  
    if (field.tokens.length !== 2) {
      throw new ParseError(
        `${fieldName}: Expected 2 characters, instead found ${field.tokens.length}, at ${field.tokens[0].position}`,
        field.tokens[0].position
      )
    }
    
    if (!field.tokens[0].value.match(rankPattern)) {
      throw new ParseError(
        `${fieldName}: Expected "[a-h]", instead found "${field.tokens[0].value}" at ${field.tokens[0].position}`,
        field.tokens[0].position
      )
    }
  
    if (!field.tokens[1].value.match(enPassantFilePattern)) {
      throw new ParseError(
        `${fieldName}: Expected "3|6", instead found "${field.tokens[1].value}" at ${field.tokens[1].position}`,
        field.tokens[1].position
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

export const parseEnPassantTargetSquare = (field: Field): string | undefined => {
  if (isDash(field.tokens[0])) {
    return undefined
  }
  return field.value
}
