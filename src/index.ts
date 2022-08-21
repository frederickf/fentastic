import { createTokens } from './createTokens.js'
import { createFields } from './createFields.js'
import { parsePieceField, validatePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor, validateActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, validateCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare, validateEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, validateHalfMoveClock, parseFullMoveNumber, validateFullMoveNumber } from './parseClocks.js'
import { ParseError } from './ParseError.js'

export { type Piece, type CastlingAvailability, ParseError }

export type ValidFen = {
  fen: string;
  valid: true;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export type InvalidFen = {
  fen: string;
  valid: false;
  error: ParseError;
}

export const parseFen = (fen: string): ValidFen | InvalidFen => {
  try {
    let tokens = createTokens(fen)
    const fields = createFields(tokens)

    validatePieceField(fields[0])
    validateActiveColor(fields[1])
    validateCastlingAvailability(fields[2])
    validateEnPassantTargetSquare(fields[3])
    validateHalfMoveClock(fields[4])
    validateFullMoveNumber(fields[5])

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

