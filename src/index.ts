import { createTokens } from './createTokens.js'
import { createFields, type Field } from './createFields.js'
import { parsePieceField, validatePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor, validateActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, validateCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare, validateEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, validateHalfMoveClock, parseFullMoveNumber, validateFullMoveNumber } from './parseClocks.js'
import { ParseError, ParseErrors } from './ParseError.js'
import { validateInputFen, InputError } from './validateInputFen.js'
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
  fen: any;
  valid: false;
  errors: (ParseError | InputError)[];
}

export type Options = {
  correctWhiteSpace: boolean
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

const hanldeErrors = (e: unknown, inputFen: any): InvalidFen => {
  if (e instanceof ParseError || e instanceof InputError) {
    return { fen: inputFen, valid: false, errors: [e] }
  }
  else if (e instanceof ParseErrors) {
    return { fen: inputFen, valid: false, errors: e.errors}
  }
  throw e
}

export const validateFen = (inputFen: string): ValidFen | InvalidFen => {
  let fen: string
  try {
    fen = validateInputFen(inputFen)
    let tokens = createTokens(fen)
    let fields = createFields(tokens)

    validateFields(fields)

    return { fen, valid: true }
  }
  catch(e) {
    return hanldeErrors(e, inputFen)
  }
}

const defaultOptions: Options = {
  correctWhiteSpace: false
}

export const parseFen = (inputFen: string, options: Options = defaultOptions): ParsedFen | InvalidFen => {
  let fen: string
  try {
    fen = validateInputFen(inputFen)
    let tokens = createTokens(fen)

    if (options.correctWhiteSpace) {
      tokens = correctWhiteSpace(tokens)
    }

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
    return hanldeErrors(e, inputFen)
  }
}

