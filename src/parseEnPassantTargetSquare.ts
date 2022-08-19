import { rankPattern, enPassantFilePattern } from './patterns.js'
import { type Token, isDash } from './token.js'
import { ParseError } from './ParseError.js'

const fieldName = 'En passant target square'
export const parseEnPassantTargetSquare = (field: Token[] ): string | undefined => {
  if (field.length === 1) {
    if (isDash(field[0])) {
      return undefined
    }
    else {
      throw new ParseError(
        `${fieldName}: Expected "-", instead found "${field[0].value}" at ${field[0].position}`,
        field[0].position
      )
    }
  }

  if (field.length !== 2) {
    throw new ParseError(
      `${fieldName}: Expected 2 characters in en passant field, found ${field.length}, at ${field[0].position}`,
      field[0].position
    )
  }
  
  if (!field[0].value.match(rankPattern)) {
    throw new ParseError(
      `${fieldName}: Expected "[a-h]", instead found "${field[0].value}" at ${field[0].position}`,
      field[0].position
    )
  }

  if (!field[1].value.match(enPassantFilePattern)) {
    throw new ParseError(
      `${fieldName}: Expected "3|6", instead found "${field[1].value}" at ${field[1].position}`,
      field[1].position
    )
  }

  return `${field[0].value}${field[1].value}`

}
