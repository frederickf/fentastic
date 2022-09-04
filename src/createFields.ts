import { type Token } from './token.js'
import { ParseError } from './ParseError.js'
import { createTokenGroups, type TokenGroup } from './createTokenGroups.js'
import { isWhiteSpace } from './whiteSpaceUtils.js'

export type Field = TokenGroup

export const createFields = (tokens: Token[]): Field[] => {
  const fields: Field[] = createTokenGroups(isWhiteSpace, tokens)

  if (fields.length !== 6) {
    // I can't think of a better position for this error
    const last: Token = tokens[tokens.length - 1]
    throw new ParseError(
      `Invalid field count. Expected "6" fields, found ${fields.length} at ${last.index}.`,
      last.index
    )
  }

  return fields
}
