import { validateFen } from '../src/index.js'

describe ('Validate input', () => {
  it('should error when FEN is not a string', () => {
    // @ts-ignore
    const result = validateFen(1)
    expect(result.valid).toEqual(false)
  })

  it('error when FEN is an empty string', () => {
    const result = validateFen('')
    expect(result.valid).toEqual(false)
  })
})

describe('Validate whitespace', () => {
  it('should be valid', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(true)
  })
  
  it('FEN must not start with an empty string', () => {
    const result = validateFen(' rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('FEN must not end with an empty string', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2 ')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('FEN must not have repeated empty strings', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR  w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('FEN must not use non ASCII white space', () => {
    // The white space between piece placement data and Active color is a tab
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR	w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
})

describe('Validate Piece placement data:', () => {
  it('should be valid', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('must not start with slash', () => {
    const result = validateFen('/rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('must not end with slash', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR/ w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('must not have too many ranks', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('must not have empty rank', () => {
    const result = validateFen('rnbqkbnr//8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  test('9 is invalid. Digits must be between 1 - 8', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/9/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  test('0 is invalid. Digits must be between 1 - 8', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/0/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  // w is an example of character that is valid elsewhere in the fen string so it is allowed
  // to reach Piece placement data. I obvsiously can't test every invalid character. this test
  // will be delete when I create a better test for only the valid characters
  test('The character "w" is not valid', () => {
    const result = validateFen('wnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  // These characters can be in the En pasant target squere (b too, but that is valid here)
  test.todo('Tests to validate the other invalid characters "a|c|d|e|f|g|h"')

  test.todo('Tests to validate the actual valid characters "p|r|n|b|q|k|P|R|N|B|Q|K"')

  // Error is first character
  it('should error on invalid characters', () => {
    const result = validateFen(';nbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  // Error is in second rank
  it('should error on two subsequent numbers', () => {
    const result = validateFen('rnbqkbnr/pp11pppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  // Error is in first rank
  it('should error when file count is too low', () => {
    const result = validateFen('rnbqkbn/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
  
  // Error is in first rank
  it('should error when file count is too high', () => {
    const result = validateFen('rnbqkbnrQ/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  // Rank is omitted from the end
  it('should error when rank count is too low', () => {
    const result = validateFen('pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
})

describe('Validate Active color:', () => {

  it('it should be valid with "w"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid with "b"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR b KQkq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be invalid with any character besides "w" or "b', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR p KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be invalid because there are too many characters', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR wb KQkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
  
})

describe('Validate Castling availability:', () => {
  it('it should be valid with "-"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w - c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid with "KQkq"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid with "Qkq"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w Qkq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid "kq"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid "q"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w q c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be invalid due to incorrect order', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w QKkq c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be invalid due to incorrect character', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkp c6 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
})

describe('Validate En passant target square:', () => {
  it('it should be valid "-"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid "c6"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c6 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid "c6"', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c3 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be invalid with any rank besides 3 or 6', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c2 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be invalid with too many characters', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c3c3 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be invalid with too few characters', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c 0 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  test.todo('need tests for every permutation of [a-h][3|6]')
})

describe('Validate Half move clock:', () => {
  it('it should be valid at zero', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 0 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid as a single digit', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 1 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid as a double digit', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 10 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be invalid when greater than 100', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 101 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be a number', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - p 2')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
})

describe('Validate Full move number:', () => {
  it('it should be valid as a single digit', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 1 2')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid as a double digit', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq - 10 20')
    expect(result.valid).toEqual(true)
  })

  it('it should be valid when greater than 100', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c3 1 101')
    expect(result.valid).toEqual(true)
  })

  it('it should be invalid as zero', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c3 1 0')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })

  it('it should be invalid with a non number character', () => {
    const result = validateFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w kq c3 1 p')
    expect(result.valid).toEqual(false)
    expect(result).toMatchSnapshot()
  })
})


