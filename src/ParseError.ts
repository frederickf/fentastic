export class ParseError {
  constructor(
    public message: string, 
    public index: number,
  ) {}
}

export class ParseErrors {
  constructor(
    public errors: ParseError[]
  ) {}
}