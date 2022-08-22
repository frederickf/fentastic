export class ParseError {
  constructor(
    public message: string, 
    public position: number,
  ) {}
}

export class ParseErrors {
  constructor(
    public errors: ParseError[]
  ) {}
}