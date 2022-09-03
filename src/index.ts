import { createTokens } from './createTokens.js'
import { createFields, type Field } from './createFields.js'
import { parsePieceField, validatePieceField, type Piece } from './parsePieceField.js'
import { parseActiveColor, validateActiveColor } from './parseActiveColor.js'
import { parseCastlingAvailability, validateCastlingAvailability, type CastlingAvailability } from './parseCastlingAvailability.js'
import { parseEnPassantTargetSquare, validateEnPassantTargetSquare } from './parseEnPassantTargetSquare.js'
import { parseHalfMoveClock, validateHalfMoveClock, parseFullMoveNumber, validateFullMoveNumber } from './parseClocks.js'
import { ParseError, ParseErrors } from './ParseError.js'
import { validateInputFen, InputError } from './validateInputFen.js'
import { correctWhiteSpace, validateWhiteSpace } from './whiteSpaceUtils.js'

export { type Piece, type CastlingAvailability, ParseError, InputError }

export type ParsedFen = {
  fen: string;
  valid: true;
  fields: string[];
  piecePlacement: Piece[];
  activeColor: string;
  castlingAvailability: CastlingAvailability | undefined;
  enPassantTargetSquare: string | undefined;
  halfmoveClock: number;
  fullmoveNumber: number;
}

export type ValidFen = {
  fen: string;
  valid: true;
}

export type InvalidFen = {
  fen: unknown;
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

const handleErrors = (e: unknown, inputFen: unknown): InvalidFen => {
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
    const tokens = createTokens(fen)
    validateWhiteSpace(tokens)
    const fields = createFields(tokens)

    validateFields(fields)

    return { fen, valid: true }
  }
  catch(e) {
    return handleErrors(e, inputFen)
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
    else {
      validateWhiteSpace(tokens)
    }

    let fields = createFields(tokens)
    fields = validateFields(fields)

    return {
      fen,
      valid: true,
      fields: fields.map((f: Field) => f.value),
      piecePlacement: parsePieceField(fields[0]),
      activeColor: parseActiveColor(fields[1]),
      castlingAvailability: parseCastlingAvailability(fields[2]),
      enPassantTargetSquare: parseEnPassantTargetSquare(fields[3]),
      halfmoveClock: parseHalfMoveClock(fields[4]),
      fullmoveNumber: parseFullMoveNumber(fields[5])
    }
  }
  catch(e) {
    return handleErrors(e, inputFen)
  }
}

