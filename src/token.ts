export type Token = {
  value: string;
  type: string;
  position: number;
}
export type isOfType = (token: Token) => boolean
type createToken = (value: string, position: number) => Token

const tokenIsOfType = (type: string): isOfType => token => token.type === type
const createTokenOfType = (type: string): createToken => (value, position) => ({type, value, position})

const alpha = 'alpha'
export const isAlpha = tokenIsOfType(alpha)
export const createAlphaToken = createTokenOfType(alpha)

const slash = 'slash'
export const isSlash = tokenIsOfType(slash)
export const createSlashToken = createTokenOfType(slash)

const ws = 'whitespace'
export const isWhiteSpace = tokenIsOfType(ws)
export const createWsToken = createTokenOfType(ws)

const dash = 'dash'
export const isDash = tokenIsOfType(dash)
export const createDashToken = createTokenOfType(dash)

const digit = 'digit'
export const isDigit = tokenIsOfType(digit)
export const createDigitToken = createTokenOfType(digit)
