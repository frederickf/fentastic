import { createTokens } from './createTokens.js'
import { createFields, fieldNames } from './createFields.js'
import { parsePieceField } from './parsePieceField.js'
import { parseSideToMove } from './parseSideToMove.js'
import { parseCastlingAbility } from './parseCastlingAbility.js'
import { parseEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock } from './parseHalfMoveClock.js'
import { parseFullMoveClock } from './parseFullMoveClock.js'

const parsers = [
  parsePieceField,
  parseSideToMove,
  parseCastlingAbility,
  parseEnPassantTargetSquare,
  parseHalfMoveClock,
  parseFullMoveClock
]

export const parseFen = (fenString = '') => {
  let tokens = createTokens(fenString.trim())
  console.log(tokens)
  let fields = createFields(tokens)
  const fenObject = {
    fenString
  }
  for (let i = 0; i < fieldNames.length; i++) {
    fenObject[fieldNames[i]] = parsers[i](fields[i])
  }
  return fenObject
}
