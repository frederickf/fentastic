import { type Token, isWhiteSpace } from './token.js'
import { ParseError } from './ParseError.js'

export const createFields = (tokens: Token[]) => {
  const fields: Token[][] = []
  let currentField: Token[] = []
  for (let i = 0; i < tokens.length; i++) {
    if (!isWhiteSpace(tokens[i])) {
      currentField.push(tokens[i])
    }

    if (isWhiteSpace(tokens[i]) || i === tokens.length - 1) {
      fields.push(currentField)
      currentField = []
    }
  }

  if (fields.length !== 6) {
    // I can't think of a better position for this error
    const last = tokens[tokens.length - 1]
    throw new ParseError(
      `Invalid field count. Expected "6" fields, found ${fields.length} at ${last.position}.`,
      last.position
    )
  }

  return fields
}
