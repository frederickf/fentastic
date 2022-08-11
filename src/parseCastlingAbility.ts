import { Token, isDash } from './token.js'

export type CastlingAbility = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
}

export const parseCastlingAbility = (field: Token[]): CastlingAbility | undefined => {
  if (field.length === 1 && isDash(field[0])) {
    return undefined
  }

  if (field.length > 4) {
    throw new Error(`Castling ability field too long. Expected 4, instead found "${field.length}" at ${field.at(-1)?.position}`)
  }

  const castlingAbility: CastlingAbility = { 
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
        castlingAbility.whiteKing = true
        break;
      case 'Q':
        nextValid = ['k', 'q']
        nextError = 'k|q'
        castlingAbility.whiteQueen = true
        break
      case 'k':
        nextValid = ['q']
        nextError = 'q'
        castlingAbility.blackKing = true
        break
      case 'q':
        nextValid = []
        nextError = 'q to be the last value'
        castlingAbility.blackQueen = true
        break
      default:
        throw new Error(`Expected "K|Q|k|q|-", instead found "${field[i].value}" at ${field[i].position}`)
    }
    let next = field[i + 1]
    if (next && !nextValid.includes(next.value)) {
      throw new Error(`Expected ${nextError}, instead found ${next.value} at ${next.position}`)
    }
  }

  return castlingAbility
}
