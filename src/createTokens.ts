import { 
  alphaPattern, slashPattern, whiteSpacePattern, dashPattern, digitPattern
} from './patterns.js'
import {
  type Token, createAlphaToken, createSlashToken, createWsToken, createDashToken, createDigitToken
} from './token.js'
import { ParseError } from './ParseError.js'

export const createTokens = (fenstr = ''): Token[] => (
  fenstr.split('').map((char: string, i: number): Token => {
    // start with alpha because b is duplicated (bishop, black side, b file)
    if (char.match(alphaPattern)) {
      return createAlphaToken(char, i)
    } 
    if (char.match(slashPattern)) {
      return createSlashToken(char, i)
    } 
    if (char.match(whiteSpacePattern)) {
      return createWsToken(char, i)
    }
    if (char.match(dashPattern)) {
      return createDashToken(char, i)
    }
    if (char.match(digitPattern)) {
      return createDigitToken(char, i)
    }
    throw new ParseError(`Invalid character "${char}" at position ${i}`, i)
  })
)
