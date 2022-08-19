import { 
  alphaPattern, slashPattern, whiteSpacePattern, dashPattern, digitPattern
} from './patterns.js'
import {
  type Token, createAlphaToken, createSlashToken, createWsToken, createDashToken, createDigitToken
} from './token.js'
import { ParseError } from './ParseError.js'

export const createTokens = (fenstr = ''): Token[] => {
  const tokens: Token[] = []
  for (let i = 0; i < fenstr.length; i++) {
    let char: string = fenstr.charAt(i)
    // We start with alpha because b is duplicated (bishop, black side, b file)
    if (char.match(alphaPattern)) {
      tokens.push(createAlphaToken(char, i))
    } 
    else if (char.match(slashPattern)) {
      tokens.push(createSlashToken(char, i))
    } 
    else if (char.match(whiteSpacePattern)) {
      tokens.push(createWsToken(char, i))
    }
    else if (char.match(dashPattern)) {
      tokens.push(createDashToken(char, i))
    }
    else if (char.match(digitPattern)) {
      tokens.push(createDigitToken(char, i))
    }
    else {
      throw new ParseError(`Invalid character "${char}" at position ${i}`, i)
    }
  }
  return tokens
}
