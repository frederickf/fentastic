import { Token } from './createTokens.js'

type isOfType = (type: string) => boolean

type isTokenOfType = (type: Token) => boolean

export const alpha = 'alpha'
export const isAlpha: isOfType = type => type === alpha

export const slash = 'slash'
export const isSlash: isOfType = type => type === slash

export const ws = 'whitespace'
export const isWhiteSpace: isOfType = type => type === ws

export const dash = 'dash'
export const isDash: isOfType = type => type === dash

export const digit = 'digit'
export const isDigit: isOfType = type => type === digit
export const isTokenDigit: isTokenOfType = token => {
  return typeof token.value === 'number' && token.type === digit
}
