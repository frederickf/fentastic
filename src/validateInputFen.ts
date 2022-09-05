export class InputError {
  constructor(
    public message: string,
    public argument: number
  ) {}
}

export const validateInputFen = (fen: unknown): string => {
  if (typeof fen !== 'string') {
    throw new InputError('FEN input must be of type \'string\'', 1)
  }
  if (!fen.length) {
    throw new InputError('FEN input string must not be empty', 1)
  }
  return fen
}