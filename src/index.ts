import { createTokens } from './createTokens.js'
import { collapseWhiteSpace } from './collapseWhiteSpace.js'
import { createFields } from './createFields.js'
import { parsePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, parseFullMoveNumber } from './parseClocks.js'
import { ParseError } from './ParseError.js'

export { type Piece, type CastlingAvailability, ParseError }

export type ValidFen = {
  fen: string;
  valid: boolean;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export type InvalidFen = {
  fen: string;
  valid: boolean;
  error: ParseError;
}

export const parseFen = (fen = ''): ValidFen | InvalidFen => {
  try {
    let tokens = createTokens(fen)
    const fields = createFields(tokens)
    return {
      fen,
      valid: true,
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
      return {
        fen,
        valid: false,
        error: e
      }
    }
    throw e
  }
}

