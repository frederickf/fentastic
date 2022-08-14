import { createTokens } from './createTokens.js'
import { collapseWhiteSpace } from './collapseWhiteSpace.js'
import { createFields } from './createFields.js'
import { parsePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, parseFullMoveNumber } from './parseClocks.js'

export { type Piece, type CastlingAvailability }

export type FenObject = {
  fen: string;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export class FenError {
  constructor(public message: string, public fen: string) {}
}

export const parseFen = (fen = '', strict = false): FenObject | FenError => {
  let response: FenObject | FenError
  try {
    let tokens = createTokens(fen.trim())
    if (!strict) {
      tokens = collapseWhiteSpace(tokens)
    }
    const fields = createFields(tokens)
    response = {
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
    const message = e instanceof Error ? e.message: "Unknown error"
    response = new FenError(message, fen)
  }

  return response
}

