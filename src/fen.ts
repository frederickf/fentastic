import { createTokens } from './createTokens.js'
import { collapseWhiteSpace } from './collapseWhiteSpace.js'
import { createFields } from './createFields.js'
import { parsePieceField } from './parsePieceField.js'
import { parseSideToMove } from './parseSideToMove.js'
import { parseCastlingAbility, CastlingAbility } from './parseCastlingAbility.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, parseFullMoveClock } from './parseClocks.js'

type FenObject = {
  fenString: string;
  piecePlacement: object[]; // TODO: describe the object contents
  sideToMove: string;
  castlingAbility: CastlingAbility | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveClock: number;
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
    sideToMove: parseSideToMove(fields[1]),
    castlingAbility: parseCastlingAbility(fields[2]),
    enPassantTargetSquare: parseEnPassantTargetSquare(fields[3]),
    halfMoveClock: parseHalfMoveClock(fields[4]),
    fullMoveClock: parseFullMoveClock(fields[5])
  }
  return fenObject
}
