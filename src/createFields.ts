import { isWhiteSpace } from './tokenTypes.js'

export const fieldNames = [
  'piecePlacement',
  'sideToMove',
  'castlingAbility',
  'enPassantTargetSquare',
  'halfMoveClock',
  'fullMoveClock'
]

export const createFields = tokens => {
  const fields = []
  let currentField = []
  for (let currentToken of tokens) {
    if (isWhiteSpace(currentToken.type) ) {
      fields.push(currentField)
      currentField = []
    }
    else {
      currentField.push(currentToken)
    }
  }
  fields.push(currentField)

  if (fields.length !== 6) {
    throw new Error(`Invalid field count. Found ${fields.length}. Expected 6.`)
  }

  return fields
}
