import { 
  alphaPattern, slashPattern, whiteSpacePattern, dashPattern, digitPattern
} from './patterns.js'
import { alpha, slash, ws, dash, digit } from './tokenTypes.js'

type Token = {
  value: string | number,
  type: string,
  position: number
}

export const createTokens = (fenStr = '') => {
  const tokens = []
  for (let char of fenStr) {
    const token: Partial<Token> = {
      value: char
    }
    // We start with alpha because b is duplicated (bishop, black side, b file)
    if (char.match(alphaPattern)) {
      token.type = alpha
    } 
    else if (char.match(slashPattern)) {
      token.type = slash
    } 
    else if (char.match(whiteSpacePattern)) {
      token.type = ws
    }
    else if (char.match(dashPattern)) {
      token.type = dash
    }
    else if (char.match(digitPattern)) {
      token.type = digit
      token.value = Number(char)
    }
    else {
      throw new Error(`Invalid character "${char}" at position ${tokens.length}`)
    }
    tokens.push(token)
    token.position = tokens.length
  }
  return tokens
}
