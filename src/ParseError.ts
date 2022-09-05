export class ParseError {
  public message: string
  public index: number

  constructor(prefix: string, found: string | number, index: number, pattern?: string, description = 'one of') {
    const expected = typeof pattern === 'string' ? `, expected ${description} "${pattern}"` : ''
    this.message = `${prefix}: Unexpected value, found "${found}"${expected}, at index ${index}`
    this.index = index
  }
}

export class ParseErrors {
  constructor(
    public errors: ParseError[]
  ) {}
}