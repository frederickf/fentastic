export class FenError {
  constructor(
    public message: string, 
    public position: number,
    public fen: string,
  ) {}
}

export class ParseError {
  constructor(
    public message: string, 
    public position: number,
  ) {}
}