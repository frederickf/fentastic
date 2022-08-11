import { Token, isWhiteSpace } from './token.js'

/**
 * Collapse whitespace down to one. The spec calls for the fields to be separated
 * by one whitespace character, so this is unnecessary, but generous
 */
 export const collapseWhiteSpace = (tokens: Token[]): Token[] => {
  let wsCount = 0
  const newTokens = []
  for (let token of tokens) {
    wsCount = isWhiteSpace(token) ? wsCount + 1 : 0
    if (wsCount <= 1 ) {
      newTokens.push(token)
    }
  }
  return newTokens
}
