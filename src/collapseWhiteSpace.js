import { isWhiteSpace } from './tokenTypes.js'

/**
 * Collapse whitespace down to one. The spec calls for the fields to be separated
 * by one whitespace character, so this is unnecessary, but generous
 * @param {array} tokens 
 * @returns {array}
 */
 export const collapseWhiteSpace = tokens => {
  let wsCount = 0
  const newTokens = []
  for (let token of tokens) {
    if (isWhiteSpace(token.type)) {
      wsCount = wsCount + 1
    }
    else {
      wsCount = 0
    }

    if (wsCount <= 1 ) {
      newTokens.push(token)
    }
  }
  return newTokens
}
