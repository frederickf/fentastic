import { type Token, isWhiteSpace } from './token.js'

export const createFields = (tokens: Token[]) => {
  const fields: Token[][] = []
  let currentField: Token[] = []
  for (let currentToken of tokens) {
    if (!isWhiteSpace(currentToken)) {
      currentField.push(currentToken)
    }
    else {
      fields.push(currentField)
      currentField = []
    }
  }
  fields.push(currentField)

  if (fields.length !== 6) {
    throw new Error(`Invalid field count. Found ${fields.length}. Expected 6.`)
  }

  return fields
}
