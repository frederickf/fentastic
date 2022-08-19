export class ParseError {
  constructor(
    public message: string, 
    public position: number,
  ) {}
}