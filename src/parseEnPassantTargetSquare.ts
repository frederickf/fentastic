import { rankPattern, enPassantFilePattern } from './patterns.js'
import { isDash } from './token.js'
import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

const fieldName = 'En passant target square'
export const validateEnPassantTargetSquare = (field: Field ): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(
        `${fieldName}: Expected "[a-h]", instead found "" at ${field.delimeter.index}`,
        field.delimeter.index
      )
    }

    if (field.tokens.length === 1) {
      if (isDash(field.tokens[0])) {
        return field
      }
      else {
        throw new ParseError(
          `${fieldName}: Expected "-", instead found "${field.value}" at ${field.tokens[0].index}`,
          field.tokens[0].index
        )
      }
    }
  
    if (field.tokens.length !== 2) {
      throw new ParseError(
        `${fieldName}: Expected 2 characters, instead found ${field.tokens.length}, at ${field.tokens[0].index}`,
        field.tokens[0].index
      )
    }
    
    if (!field.tokens[0].value.match(rankPattern)) {
      throw new ParseError(
        `${fieldName}: Expected "[a-h]", instead found "${field.tokens[0].value}" at ${field.tokens[0].index}`,
        field.tokens[0].index
      )
    }
  
    if (!field.tokens[1].value.match(enPassantFilePattern)) {
      throw new ParseError(
        `${fieldName}: Expected "3|6", instead found "${field.tokens[1].value}" at ${field.tokens[1].index}`,
        field.tokens[1].index
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
