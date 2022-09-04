import { type Token, tokenIs } from './token.js'
import { ParseError } from './ParseError.js'

export const isWhiteSpace = tokenIs(/ /)
const isAnyWhiteSpace = tokenIs(/\s/)


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
    throw new ParseError(
      `Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "${tokens[0].value}" at 0`, 0
    )
  }
  const repeatedWsToken = tokens.find((token, i, tokens) => (
    isAnyWhiteSpace(token) && tokens[i - 1] && isAnyWhiteSpace(tokens[i - 1])
  ))
  if (repeatedWsToken) {
    throw new ParseError(
      `Expected "p|r|n|b|q|k|P|R|N|B|Q|K|w|-|/" or "0-9", instead found "${repeatedWsToken.value}", at ${repeatedWsToken.index}`, 
      repeatedWsToken.index
    )
  }
  if (isAnyWhiteSpace(tokens.at(-1)!)) {
    throw new ParseError(
      `Expected "1-9", instead found "${tokens.at(-1)!.value}" at ${tokens.at(-1)!.index}`,
      tokens.at(-1)!.index
    )
  }
  forEachWsToken(tokens, (t: Token) => {
    if (!isWhiteSpace(t)) {
      throw new ParseError(
        `Expected ASCII space, instead found non ASCII space ${t.value}, at ${t.index}`,
        t.index
      )
    }
  })
  return tokens
}