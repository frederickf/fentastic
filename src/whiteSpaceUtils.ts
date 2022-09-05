import { type Token, tokenIs } from './token.js'
import { ParseError } from './ParseError.js'

export const isWhiteSpace = tokenIs(/ /)
const isAnyWhiteSpace = tokenIs(/\s/)

const prefix = 'Whitespace'

// Collapses string of white spaces into a single white space
const collapseWhiteSpace = (tokens: Token[]): Token[] => {
  return tokens.filter(((token, i) => (
    !isAnyWhiteSpace(token) || !tokens[i - 1] || !isAnyWhiteSpace(tokens[i - 1])
  )))
}

const forEachWsToken = (tokens: Token[], fn: (t: Token) => void): void => {
  tokens.filter(isAnyWhiteSpace).forEach(fn)
}

export const correctWhiteSpace = (tokens: Token[]): Token[] => {
  tokens = collapseWhiteSpace(tokens)
  if (isAnyWhiteSpace(tokens[0])) {
    tokens.shift()
  }
  if (isAnyWhiteSpace(tokens.at(-1)!)) {
    tokens.pop()
  }
  forEachWsToken(tokens, (t: Token) => {
    t.value = ' '
  })
  return tokens
} 

export const validateWhiteSpace = (tokens: Token[]): Token[] => {
  if (isAnyWhiteSpace(tokens[0])) {
    throw new ParseError(prefix, tokens[0].value, 0)
  }
  const repeatedWsToken = tokens.find((token, i, tokens) => (
    isAnyWhiteSpace(token) && tokens[i - 1] && isAnyWhiteSpace(tokens[i - 1])
  ))
  if (repeatedWsToken) {
    throw new ParseError(prefix, repeatedWsToken.value, repeatedWsToken.index)
  }
  if (isAnyWhiteSpace(tokens.at(-1)!)) {
    throw new ParseError(prefix, tokens.at(-1)!.value, tokens.at(-1)!.index)
  }
  forEachWsToken(tokens, (t: Token) => {
    if (!isWhiteSpace(t)) {
      throw new ParseError(prefix, t.value, t.index, ' ', 'ASCII space')
    }
  })
  return tokens
}