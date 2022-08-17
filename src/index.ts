import { createTokens } from './createTokens.js'
import { collapseWhiteSpace } from './collapseWhiteSpace.js'
import { createFields } from './createFields.js'
import { parsePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, parseFullMoveNumber } from './parseClocks.js'
import { FenError, ParseError } from './Errors.js'

export { type Piece, type CastlingAvailability, FenError}

export type FenObject = {
  fen: string;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export const parseFen = (fen = '', strict = false): FenObject | FenError => {
  try {
    let tokens = createTokens(fen.trim())
    if (!strict) {
      tokens = collapseWhiteSpace(tokens)
    }
    const fields = createFields(tokens)
    return {
      fen,
      piecePlacement: parsePieceField(fields[0]),
      activeColor: parseActiveColor(fields[1]),
      castlingAvailability: parseCastlingAvailability(fields[2]),
      enPassantTargetSquare: parseEnPassantTargetSquare(fields[3]),
      halfMoveClock: parseHalfMoveClock(fields[4]),
      fullMoveNumber: parseFullMoveNumber(fields[5])
    }
  }
  catch(e) {
    if (e instanceof ParseError) {
      return new FenError(e.message, e.position, fen)
    }
    throw e
  }
}

