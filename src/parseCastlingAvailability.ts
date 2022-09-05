import { ParseError } from './ParseError.js'
import { type Field } from './createFields.js'

export type CastlingAvailability = {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
}

const fieldName = 'Castling availability'

export const validateCastlingAvailability = (field: Field): Field => {
  try {
    if (!field.tokens.length) {
      throw new ParseError(fieldName, '', field.delimiter.index, '-|Q|K|q|k')
    }

    if (field.tokens.length === 1 && field.value === '-') {
      return field
    }

  
    if (field.tokens.length > 4) {
      const lastToken = field.tokens[field.tokens.length - 1]
      throw new ParseError(fieldName, field.tokens.length, lastToken.index, '1-4', 'field length to be')
    }
  
    for (let i = 0; i < field.tokens.length; i++) {
      let nextValid: string[] = []
      let nextError: string | undefined
      switch(field.tokens[i].value) {
        case 'K':
          nextValid = ['Q', 'k', 'q']
          nextError = 'Q|k|q'
          break
        case 'Q':
          nextValid = ['k', 'q']
          nextError = 'k|q'
          break
        case 'k':
          nextValid = ['q']
          nextError = 'q'
          break
        case 'q':
          nextValid = []
          nextError = undefined
          break
        default:
          throw new ParseError(fieldName, field.tokens[i].value, field.tokens[i].index, 'Q|K|q|k')
      }
      const next = field.tokens[i + 1]
      if (next && !nextValid.includes(next.value)) {
        throw new ParseError(fieldName, next.value, next.index, nextError)
      }
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

export const parseCastlingAvailability = (field: Field): CastlingAvailability | undefined => {
  if (field.value === '-') {
    return undefined
  }

  return { 
    whiteKingside: field.value.includes('K'),
    whiteQueenside: field.value.includes('Q'), 
    blackKingside: field.value.includes('k'),
    blackQueenside: field.value.includes('q')
  }
}