import { parseFen, ParsedFen } from '../src/index.js'

describe('Parsing a valid FEN', () => {
  it('should have the expected fields', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1')
    expect(result).toHaveProperty('fen')
    expect(result).toHaveProperty('valid', true)
    expect(result).toHaveProperty('fields')
    expect(result).toHaveProperty('piecePlacement')
    expect(result).toHaveProperty('activeColor')
    expect(result).toHaveProperty('castlingAvailability')
    expect(result).toHaveProperty('enPassantTargetSquare')
    expect(result).toHaveProperty('halfmoveClock')
    expect(result).toHaveProperty('fullmoveNumber')
  })
})

describe('Parsing a invalid FEN', () => {
  it('should have the expected fields', () => {
    const result = parseFen('/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1')
    expect(result).toHaveProperty('fen')
    expect(result).toHaveProperty('valid', false)
    expect(result).toHaveProperty('errors')
  })
})

describe('Options tests', () => {
  it('should accept the correctWhiteSpace option', () => {
    const fen = '   rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR   w KQkq c3 0 1  '
    const result = parseFen(fen, {correctWhiteSpace: true})
    expect(result).toHaveProperty('fen', fen)
    expect(result).toHaveProperty('valid', true)
  })
})

describe('Parsing active color field', () => {
  it('activeColor should be "white"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1')
    expect(result).toHaveProperty('activeColor', 'white')
  })

  it('activeColor should be "black"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq c3 0 1')
    expect(result).toHaveProperty('activeColor', 'black')
  })
})

describe('Parsing castling availability field', () => {
  it('should be correct for KQkq', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1') as ParsedFen
    expect(result.castlingAvailability).toHaveProperty('whiteKingside', true)
    expect(result.castlingAvailability).toHaveProperty('whiteQueenside', true)
    expect(result.castlingAvailability).toHaveProperty('blackKingside', true)
    expect(result.castlingAvailability).toHaveProperty('blackQueenside', true)
  })

  it('should be correct for "Qkq"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Qkq c3 0 1') as ParsedFen
    expect(result.castlingAvailability).toHaveProperty('whiteKingside', false)
    expect(result.castlingAvailability).toHaveProperty('whiteQueenside', true)
    expect(result.castlingAvailability).toHaveProperty('blackKingside', true)
    expect(result.castlingAvailability).toHaveProperty('blackQueenside', true)
  })

  it('should be correct for "kq"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kq c3 0 1') as ParsedFen
    expect(result.castlingAvailability).toHaveProperty('whiteKingside', false)
    expect(result.castlingAvailability).toHaveProperty('whiteQueenside', false)
    expect(result.castlingAvailability).toHaveProperty('blackKingside', true)
    expect(result.castlingAvailability).toHaveProperty('blackQueenside', true)
  })

  it('should be correct for "q"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w q c3 0 1') as ParsedFen
    expect(result.castlingAvailability).toHaveProperty('whiteKingside', false)
    expect(result.castlingAvailability).toHaveProperty('whiteQueenside', false)
    expect(result.castlingAvailability).toHaveProperty('blackKingside', false)
    expect(result.castlingAvailability).toHaveProperty('blackQueenside', true)
  })

  it('should be correct for "-"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - c3 0 1') as ParsedFen
    expect(result.castlingAvailability).toBeUndefined()
  })
})

describe('Parsing en passant target square field', () => {
  it('should be correct for a valid value', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1') as ParsedFen
    expect(result.enPassantTargetSquare).toEqual('c3')
  })

  it('should be correct for a "-"', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') as ParsedFen
    expect(result.enPassantTargetSquare).toBeUndefined()
  })
})

describe('Parsing half move clock field', () => {
  it('should be correct for a valid value', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 1 1') as ParsedFen
    expect(result.halfmoveClock).toEqual(1)
  })
})

describe('Parsing fullmove number field', () => {
  it('should be correct for a valid value', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 1 1') as ParsedFen
    expect(result.halfmoveClock).toEqual(1)
  })
})