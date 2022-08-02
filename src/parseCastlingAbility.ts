import { isDash } from './tokenTypes.js'
import { Token } from './createTokens.js'

export type CastlingAbility = {
  whiteKing: boolean;
  whiteQueen: boolean;
  blackKing: boolean;
  blackQueen: boolean;
}

export const parseCastlingAbility = (field: Token[]): CastlingAbility | undefined => {
  if (field.length === 1 && isDash(field[0].type)) {
    return undefined
  }

  const castlingAbility: CastlingAbility = { 
    whiteKing: false,
    whiteQueen: false, 
    blackKing: false,
    blackQueen: false
 }

  for (let token of field) {
    switch(token.value) {
      case 'K':
        castlingAbility.whiteKing = true
        break;
      case 'Q':
        castlingAbility.whiteQueen = true
        break
      case 'k':
        castlingAbility.blackKing = true
        break
      case 'q':
        castlingAbility.blackQueen = true
        break
      default:
        throw new Error(`Expected "K|Q|k|q|-", instead found "${token.value}" at ${token.position}`)
    }
  }

  return castlingAbility
}
