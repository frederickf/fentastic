import { ParseError } from './ParseError.js';
import { type Token } from './token.js'
import { isOfType } from './token.js'

export type TokenGroup = {
  value: string;
  tokens: Token[];
  delimeter: Token;
  error?: ParseError
}

const split = (isDelimiter: isOfType, tokens: Token[]): Token[][]=> {
  const result: Token[][] = [[]]
  for (let token of tokens) {
    isDelimiter(token) ? result.push([token]) : result.at(-1)?.push(token)
  }
  return result;
}

export const createTokenGroups = (isDelimiter: isOfType, tokens: Token[]): TokenGroup[]=> (
  split(isDelimiter, tokens).map((group: Token[]): TokenGroup => ({
    value: group.filter(token => !isDelimiter(token)).map(token => token.value).join(''),
    delimeter: group.find(isDelimiter) || { value: '', type: '', index: 0 },
    tokens: group.filter(token => !isDelimiter(token))
  }))
)