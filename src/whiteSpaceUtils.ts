import { type Token, isWhiteSpace } from './token.js'
import { ParseError } from './ParseError.js'

// Collapses string of white spaces into a single white space
const collapseWhiteSpace = (tokens: Token[]): Token[] => {
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

export const validateWhiteSpace = (tokens: Token[]): Token[] => {
  if (isWhiteSpace(tokens[0])) {
    throw new ParseError(
      'Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found " " at 0', 0
    )
  }
  const invalidRepeatedWs = tokens.find((token, i, tokens) => (
    isWhiteSpace(token) && tokens[i - 1] && isWhiteSpace(tokens[i - 1])
  ))
  if (invalidRepeatedWs) {
    throw new ParseError(
      `Expected "p|r|n|b|q|k|P|R|N|B|Q|K|w|-|/" or "0-9", instead found " ", at ${invalidRepeatedWs.index}`, 
      invalidRepeatedWs.index
    )
  }
  if (isWhiteSpace(tokens.at(-1)!)) {
    throw new ParseError(
      `Expected "0-9", instead found " " at ${tokens.at(-1)!.index}`,
      tokens.at(-1)!.index
    )
  }
  return tokens
}