import { type Token, isWhiteSpace } from './token.js'
import { ParseError } from './ParseError.js'

export type Field = {
  value: string;
  tokens: Token[];
}

export const createFields_old = (tokens: Token[]) => {
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

export const createFields = (tokens: Token[]): Field[] => {
  const fields: Field[] = []
  let fieldValue = '',
  fieldTokens: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (!isWhiteSpace(tokens[i])) {
      fieldValue = fieldValue + tokens[i].value
      fieldTokens.push(tokens[i])
    }

    if (isWhiteSpace(tokens[i]) || i === tokens.length - 1) {
      fields.push({
        value: fieldValue,
        tokens: fieldTokens
      })
      fieldValue = ''
      fieldTokens = []
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
