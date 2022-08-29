import { parseFen } from '../src/index.js'

describe('Parsing a valid FEN', () => {
  it('should have the expected fields', () => {
    const result = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq c3 0 1')
    expect(result).toHaveProperty('fen')
    expect(result).toHaveProperty('valid', true)
    expect(result).toHaveProperty('piecePlacement')
    expect(result).toHaveProperty('activeColor')
    expect(result).toHaveProperty('castlingAvailability')
    expect(result).toHaveProperty('enPassantTargetSquare')
    expect(result).toHaveProperty('halfMoveClock')
    expect(result).toHaveProperty('fullMoveNumber')
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