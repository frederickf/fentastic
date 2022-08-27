import { type Token, isWhiteSpace } from './token.js'

// Collapses string of white spaces into a single white space
export const collapseWhiteSpace = (tokens: Token[]): Token[] => {
  return tokens.filter(((token, i) => (
    !isWhiteSpace(token) || !tokens[i - 1] || !isWhiteSpace(tokens[i - 1])
  )))
}

export const correctWhiteSpace = (tokens: Token[]): Token[] => {
  tokens = collapseWhiteSpace(tokens)
  if (isWhiteSpace(tokens[0])) {
    tokens.shift()
  }
  if (isWhiteSpace(tokens.at(-1)!)) {
    tokens.pop()
  }
  return tokens
} 