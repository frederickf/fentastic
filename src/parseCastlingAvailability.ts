import { type Token, isDash } from './token.js'

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
    throw new Error(`${fieldName}: Field too long. Expected 4, instead found "${field.length}" at ${field.at(-1)?.position}`)
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
        throw new Error(`${fieldName}: Expected "K|Q|k|q|-", instead found "${field[i].value}" at ${field[i].position}`)
    }
    let next = field[i + 1]
    if (next && !nextValid.includes(next.value)) {
      throw new Error(`${fieldName}: Expected ${nextError}, instead found ${next.value} at ${next.position}`)
    }
  }

  return castlingAvailability
}
