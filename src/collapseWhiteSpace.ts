import { type Token, isWhiteSpace } from './token.js'

/**
 * Collapse whitespace down to one. The spec calls for the fields to be separated
 * by one whitespace character, so this is unnecessary. As of this comment it isn't
 * being used.
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
