import { isDash } from './tokenTypes.js'

export const validate = field => {
  
}

export const parseCastlingAbility = field => {
  if (field.length === 1 && isDash(field[0].type)) {
    return undefined
  }

  const castlingAbility = { 
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
