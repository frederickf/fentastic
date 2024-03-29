import { type Token } from './token.js'
import { ParseError, ParseErrors } from './ParseError.js'
import { createTokenGroups, type TokenGroup } from './createTokenGroups.js'
import { isWhiteSpace } from './whiteSpaceUtils.js'
import { validatePieceField } from './parsePieceField.js'
import { validateActiveColor } from './parseActiveColor.js'
import { validateCastlingAvailability } from './parseCastlingAvailability.js'
import { validateEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { validateHalfMoveClock, validateFullMoveNumber } from './parseClocks.js'

export type Field = TokenGroup
export type Fields = [TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup]

export const validateFields = (fields: Fields): Fields => {
  validatePieceField(fields[0])
  validateActiveColor(fields[1])
  validateCastlingAvailability(fields[2])
  validateEnPassantTargetSquare(fields[3])
  validateHalfMoveClock(fields[4])
  validateFullMoveNumber(fields[5])

  const errors = fields
    .filter((f): f is Required<Field> => f.error instanceof ParseError)
    .map((f) => f.error)
  
  if (errors.length) {
    throw new ParseErrors(errors)
  }

  return fields
}

export const createFields = (tokens: Token[]): Fields => {
  const tokenGroups: TokenGroup[] = createTokenGroups(isWhiteSpace, tokens)

  if (tokenGroups.length !== 6) {
    const last: Token = tokens[tokens.length - 1]
    throw new ParseError('Fields', tokenGroups.length, last.index, '6', 'field count to be', 'count')
  }
  
  return tokenGroups as Fields
}
