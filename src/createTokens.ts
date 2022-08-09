import { 
  alphaPattern, slashPattern, whiteSpacePattern, dashPattern, digitPattern
} from './patterns.js'
import { alpha, slash, ws, dash, digit } from './tokenTypes.js'

export type Token = {
  value: string;
  type: string;
  position: number;
}

export const createTokens = (fenstr = ''): Token[] => {
  const tokens: Token[] = []
  for (let i = 0; i < fenstr.length; i++) {
    let char: string = fenstr.charAt(i)
    // We start with alpha because b is duplicated (bishop, black side, b file)
    if (char.match(alphaPattern)) {
      tokens.push({type: 'alpha', value: char, position: i})
    } 
    else if (char.match(slashPattern)) {
      tokens.push({type: 'slash', value: char, position: i})
    } 
    else if (char.match(whiteSpacePattern)) {
      tokens.push({type: 'whitespace', value: char, position: i})
    }
    else if (char.match(dashPattern)) {
      tokens.push({type: 'dash', value: char, position: i})
    }
    else if (char.match(digitPattern)) {
      tokens.push({type: 'digit', value: char, position: i})
    }
    else {
      throw new Error(`Invalid character "${char}" at position ${i}`)
    }
  }
  return tokens
}
