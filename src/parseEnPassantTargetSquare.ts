import { rankPattern, enPassantFilePattern } from './patterns.js'
import { isDash } from './tokenTypes.js'
import { Token } from './createTokens.js'

export const parseEnPassantTargetSquare = (field: Token[] ): string | undefined => {
  if (field.length === 1) {
    if (isDash(field[0].type)) {
      return undefined
    }
    else {
      throw new Error(`Expected "-", instead found "${field[0].value}" at ${field[0].position}`)
    }
  }

  if (field.length !== 2) {
    throw new Error(`Expected 2 characters in en passant field, found ${field.length}`)
  }
  
  if (!field[0].value.match(rankPattern)) {
    throw new Error(`Expected "[a-h]", instead found "${field[0].value}" at ${field[0].position}`)
  }

  if (field[1].value.match(enPassantFilePattern)) {
    throw new Error(`Expected "3|6", instead found "${field[1].value}" at ${field[1].position}`)
  }

  return `${field[0].value}${field[1].value}`

}
