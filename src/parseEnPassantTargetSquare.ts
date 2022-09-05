import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

const rankPattern = /[a-h]/gi
const enPassantFilePattern = /3|6/g


const fieldName = 'En passant target square'

export const validateEnPassantTargetSquare = (field: Field ): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(fieldName, '', field.delimiter.index, '-|a-h')
    }

    if (field.value === '-') {
      return field
    }
  
    if (field.tokens.length !== 2) {
      throw new ParseError(fieldName, field.tokens.length, field.tokens[0].index, '2', 'field length to be')
    }
    
    if (!field.tokens[0].value.match(rankPattern)) {
      throw new ParseError(fieldName, field.tokens[0].value, field.tokens[0].index, 'a-h')
    }
  
    if (!field.tokens[1].value.match(enPassantFilePattern)) {
      throw new ParseError(fieldName, field.tokens[1].value, field.tokens[1].index, '3|6')
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

export const parseEnPassantTargetSquare = (field: Field): string | undefined => {
  if (field.value === '-') {
    return undefined
  }
  return field.value
}
