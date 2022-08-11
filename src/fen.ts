import { createTokens } from './createTokens.js'
import { collapseWhiteSpace } from './collapseWhiteSpace.js'
import { createFields } from './createFields.js'
import { parsePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, parseFullMoveNumber } from './parseClocks.js'

type FenObject = {
  fenString: string;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export const parseFen = (fenString = '', strict = false) => {
  let tokens = createTokens(fenString.trim())
  if (!strict) {
    tokens = collapseWhiteSpace(tokens)
  }
  const fields = createFields(tokens)
  const fenObject: FenObject = {
    fenString,
    piecePlacement: parsePieceField(fields[0]),
    activeColor: parseActiveColor(fields[1]),
    castlingAvailability: parseCastlingAvailability(fields[2]),
    enPassantTargetSquare: parseEnPassantTargetSquare(fields[3]),
    halfMoveClock: parseHalfMoveClock(fields[4]),
    fullMoveNumber: parseFullMoveNumber(fields[5])
  }
  return fenObject
}
