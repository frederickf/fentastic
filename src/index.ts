import { createTokens } from './createTokens.js'
import { createFields, type Field } from './createFields.js'
import { parsePieceField, validatePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor, validateActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, validateCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare, validateEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, validateHalfMoveClock, parseFullMoveNumber, validateFullMoveNumber } from './parseClocks.js'
import { ParseError, ParseErrors } from './ParseError.js'
import { correctWhiteSpace } from './correctWhiteSpace.js'

export { type Piece, type CastlingAvailability, ParseError }

export type ParsedFen = {
  fen: string;
  valid: true;
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfMoveClock: number;
  fullMoveNumber: number;
}

export type ValidFen = {
  fen: string;
  valid: true;
}

export type InvalidFen = {
  fen: string;
  valid: false;
  errors: ParseError[];
}

const validateFields = (fields: Field[]): Field[] => {
  validatePieceField(fields[0])
  validateActiveColor(fields[1])
  validateCastlingAvailability(fields[2])
  validateEnPassantTargetSquare(fields[3])
  validateHalfMoveClock(fields[4])
  validateFullMoveNumber(fields[5])

const errors = fields
  .filter((f): f is Required<Field> => f.error instanceof ParseError)
  .map((f) => f.error)
  
  if (errors.length) {
    throw new ParseErrors(errors)
  }

  return fields
}

export const validateFen = (fen: string): ValidFen | InvalidFen => {
  try {
    let tokens = createTokens(fen)
    let fields = createFields(tokens)

    validateFields(fields)

    return { fen, valid: true }
  }
  catch(e) {
    if (e instanceof ParseError) {
      return { fen, valid: false, errors: [e] }
    }
    else if (e instanceof ParseErrors) {
      return { fen, valid: false, errors: e.errors}
    }
    throw e
  }
}

export const parseFen = (fen: string): ParsedFen | InvalidFen => {
  try {
    let tokens = createTokens(fen)
    let fields = createFields(tokens)

    fields = validateFields(fields)

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
      return { fen, valid: false, errors: [e] }
    }
    else if (e instanceof ParseErrors) {
      return { fen, valid: false, errors: e.errors}
    }
    throw e
  }
}

