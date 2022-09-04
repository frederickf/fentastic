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
      throw new ParseError(
        `${fieldName}: Expected "-|Q|K|q|k", instead found "" at ${field.delimiter.index}`,
        field.delimiter.index
      )
    }

    if (field.tokens.length === 1 && field.value === '-') {
      return field
    }

  
    if (field.tokens.length > 4) {
      const lastToken = field.tokens[field.tokens.length - 1]
      throw new ParseError(
        `${fieldName}: Expected "4", instead found "${field.tokens.length}" at ${lastToken.index}`,
        lastToken.index
      )
    }
  
    for (let i = 0; i < field.tokens.length; i++) {
      let nextValid: string[] = []
      let nextError = ''
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
          nextError = 'q to be the last value'
          break
        default:
          throw new ParseError(
            `${fieldName}: Expected "K|Q|k|q", instead found "${field.tokens[i].value}" at ${field.tokens[i].index}`,
            field.tokens[i].index
          )
      }
      const next = field.tokens[i + 1]
      if (next && !nextValid.includes(next.value)) {
        throw new ParseError(
          `${fieldName}: Expected "${nextError}", instead found "${next.value}" at ${next.index}`,
          next.index
        )
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