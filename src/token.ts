export type Token = {
  value: string;
  index: number;
}

export type isOfType = (token: Token) => boolean

export const tokenIs = (pattern: RegExp): isOfType => token => pattern.test(token.value)

export const createTokens = (fen = ''): Token[] => (
  fen.split('').map((value: string, index: number): Token => ({value, index}))
)
