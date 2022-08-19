import { type Token, isDash } from './token.js'
import { ParseError } from './ParseError.js';

export type CastlingAvailability = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
}

const fieldName = 'Castling availability'

export const parseCastlingAvailability = (field: Token[]): CastlingAvailability | undefined => {
  if (field.length === 1 && isDash(field[0])) {
    return undefined
  }

  if (field.length > 4) {
    // TS thinks the last element could be undefined so I had to cast here
    const lastToken = field[field.length - 1]
    throw new ParseError(
      `${fieldName}: Field too long. Expected 4, instead found "${field.length}" at ${lastToken.position}`,
      lastToken.position
    )
  }

  const castlingAvailability: CastlingAvailability = { 
    whiteKing: false,
    whiteQueen: false, 
    blackKing: false,
    blackQueen: false
 }

  for (let i = 0; i < field.length; i++) {
    let nextValid: string[]
    let nextError: string
    switch(field[i].value) {
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
          `${fieldName}: Expected "K|Q|k|q|-", instead found "${field[i].value}" at ${field[i].position}`,
          field[i].position
        )
    }
    let next = field[i + 1]
    if (next && !nextValid.includes(next.value)) {
      throw new ParseError(
        `${fieldName}: Expected ${nextError}, instead found ${next.value} at ${next.position}`,
        next.position
      )
    }
  }

  return castlingAvailability
}
