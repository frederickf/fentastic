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

export const parseCastlingAvailability = (field: Field): CastlingAvailability | undefined => {
  if (field.tokens.length === 1 && isDash(field.tokens[0])) {
    return undefined
  }

  if (field.tokens.length > 4) {
    // TS thinks the last element could be undefined so I had to cast here
    const lastToken = field.tokens[field.tokens.length - 1]
    throw new ParseError(
      `${fieldName}: Field too long. Expected 4, instead found "${field.tokens.length}" at ${lastToken.position}`,
      lastToken.position
    )
  }

  const castlingAvailability: CastlingAvailability = { 
    whiteKing: false,
    whiteQueen: false, 
    blackKing: false,
    blackQueen: false
 }

  for (let i = 0; i < field.tokens.length; i++) {
    let nextValid: string[]
    let nextError: string
    switch(field.tokens[i].value) {
      case 'K':
        nextValid = ['Q', 'k', 'q']
        nextError = 'Q|k|q'
        castlingAvailability.whiteKing = true
        break;
      case 'Q':
        nextValid = ['k', 'q']
        nextError = 'k|q'
        castlingAvailability.whiteQueen = true
        break
      case 'k':
        nextValid = ['q']
        nextError = 'q'
        castlingAvailability.blackKing = true
        break
      case 'q':
        nextValid = []
        nextError = 'q to be the last value'
        castlingAvailability.blackQueen = true
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
        `${fieldName}: Expected ${nextError}, instead found ${next.value} at ${next.position}`,
        next.position
      )
    }
  }

  return castlingAvailability
}
