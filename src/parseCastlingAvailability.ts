import { type Token, isDash } from './token.js'
import { ParseError } from './ParseError.js';
import { type Field } from './createFields.js'

export type CastlingAvailability = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
}

const fieldName = 'Castling availability'

export const validateCastlingAvailability = (field: Field): Field => {
  if (field.tokens.length === 1 && isDash(field.tokens[0])) {
    return field
  }

  if (field.tokens.length > 4) {
    const lastToken = field.tokens[field.tokens.length - 1]
    throw new ParseError(
      `${fieldName}: Expected "4", instead found "${field.tokens.length}" at ${lastToken.position}`,
      lastToken.position
    )
  }

  for (let i = 0; i < field.tokens.length; i++) {
    let nextValid: string[]
    let nextError: string
    switch(field.tokens[i].value) {
      case 'K':
        nextValid = ['Q', 'k', 'q']
        nextError = 'Q|k|q'
        break;
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
          `${fieldName}: Expected "K|Q|k|q|-", instead found "${field.tokens[i].value}" at ${field.tokens[i].position}`,
          field.tokens[i].position
        )
    }
    let next = field.tokens[i + 1]
    if (next && !nextValid.includes(next.value)) {
      throw new ParseError(
        `${fieldName}: Expected "${nextError}", instead found "${next.value}" at ${next.position}`,
        next.position
      )
    }
  }

  return field
}


export const parseCastlingAvailability = (field: Field): CastlingAvailability | undefined => {
  if (field.tokens.length === 1 && isDash(field.tokens[0])) {
    return undefined
  }

  const castlingAvailability: CastlingAvailability = { 
    whiteKing: false,
    whiteQueen: false, 
    blackKing: false,
    blackQueen: false
 }

  for (let i = 0; i < field.tokens.length; i++) {
    switch(field.tokens[i].value) {
      case 'K':
        castlingAvailability.whiteKing = true
        break;
      case 'Q':
        castlingAvailability.whiteQueen = true
        break
      case 'k':
        castlingAvailability.blackKing = true
        break
      case 'q':
        castlingAvailability.blackQueen = true
        break
      default:
        // TODO: Conider refactoring so I can use a typescript "never" check here
    }
  }

  return castlingAvailability
}