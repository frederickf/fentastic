import { whitePiecePattern, blackPiecePattern } from './patterns.js'
import { type Token, isDigit, isSlash, isAlpha } from './token.js'
import { type Field } from './createFields.js'
import { ParseError } from './ParseError.js'
import { createTokenGroups, type TokenGroup } from './createTokenGroups.js'

type PieceToken = Token & {
  rank: number;
  file: string;
}

export type Piece = {
  position: string;
  color: 'white'|'black';
  type: string;
}

type PieceTypes = {
  p: 'Pawn';
  n: 'Knight';
  r: 'Rook';
  b: 'Bishop';
  k: 'King';
  q: 'Queen';
}

type Rank = TokenGroup

const fieldName = 'Piece placement data'

const tokensMustExist = (field: Field): void => {
  const tokens: Token[] = field.tokens
  if (!tokens.length) {
    throw new ParseError(
      `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "" at ${field.delimiter.index}}`,
      field.delimiter.index
    )
  }
}

const mustNotStartWithSlash = (field: Field) => {
  const tokens: Token[] = field.tokens
  if (isSlash(tokens[0])) {
    throw new ParseError(
      `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "${tokens[0].value}" at ${tokens[0].index}`,
      tokens[0].index
    )
  }
}

const mustNotEndWithSlash = (field: Field): void => {
  const tokens: Token[] = field.tokens
  const lastIndex = tokens.length - 1
  if (isSlash(tokens[lastIndex])) {
    throw new ParseError(
      `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "${tokens[lastIndex].value}" at ${tokens[lastIndex].index}`,
      tokens[lastIndex].index
    )
  }
}

const rankMustNotBeEmpty = (rank: Rank): void => {
  if (!rank.tokens.length) {
    throw new ParseError(
      `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "" at ${rank.delimiter.index}`,
      rank.delimiter.index
    )
  }
}

const validateTokens = (rank: Rank): void => {
  for (let i = 0; i < rank.tokens.length; i++) {
    const currentToken: Token = rank.tokens[i]

    if (isDigit(currentToken)) {
      const currentTokenValue = Number(currentToken.value)
      if (currentTokenValue < 1 || currentTokenValue > 8) {
        throw new ParseError(
          `${fieldName}: Numbers must be between 1-8, instead found "${currentToken.value}" at ${currentToken.index}`,
          currentToken.index
        )
      }
    }
    else if (!currentToken.value.match(whitePiecePattern) && !currentToken.value.match(blackPiecePattern)) {
      throw new ParseError(
        `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found "${currentToken.value}" at ${currentToken.index}`,
        currentToken.index
      )
    }
    else {
      if (!isAlpha(currentToken) && !isDigit(currentToken)) {
        throw new ParseError(
          `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K", "1-8", instead found "${currentToken.value}" at ${currentToken.index}`,
          currentToken.index
        )
      }
    }
  }
}

const validateNextDigit = (rank: Rank): void => {
  for (let i = 0; i < rank.tokens.length; i++) {
    const currentToken: Token = rank.tokens[i]
    const nextToken: Token = rank.tokens[i + 1]
    if (isDigit(currentToken) && nextToken && isDigit(nextToken)) {
      throw new ParseError(
        `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found "${nextToken.value}" at ${nextToken.index}.`,
        nextToken.index
      )
    }
  }
}

const validateFileCount = (rank: Rank): void => {
  let fileCount = 0
  for (let i = 0; i < rank.tokens.length; i++) {
    const token: Token = rank.tokens[i]
    if (isDigit(token)) {
      fileCount = fileCount + Number(token.value)
    } 
    if (isAlpha(token)) {
      fileCount = fileCount + 1
    }
    if (fileCount > 8) {
      throw new ParseError(
        `${fieldName}: File count must not exceed "8", instead found "${fileCount}" at ${token.index}`,
        token.index
      )
    }
    if (i === rank.tokens.length - 1 && fileCount !== 8 ) {
      throw new ParseError(
        `${fieldName}: Expected file count of "8", instead found "${fileCount}" at ${token.index}`,
        token.index
      )
    }
  }
}

const validateRankCount = (ranks: Rank[]): void => {
  if (ranks.length !== 8) {
    throw new ParseError(
      `${fieldName}: Expected rank count of "8", instead found "${ranks.length}" at ${ranks[ranks.length -1].delimiter.index}.`,
      ranks[ranks.length -1].delimiter.index
    )
  }
}

export const validatePieceField = (field: Field): Field => {
  try {
    // TODO: I don't think it is possible to get this far without tokens
    // now that there is an upstream test for empty input string
    tokensMustExist(field)
    mustNotStartWithSlash(field)
    mustNotEndWithSlash(field)
    const ranks: Rank[] = createTokenGroups(isSlash, field.tokens)
    for (const rank of ranks) {
      rankMustNotBeEmpty(rank)
      validateTokens(rank)
      validateNextDigit(rank)
      validateFileCount(rank)
    }
    validateRankCount(ranks)
  }
  catch(e) {
    if (e instanceof ParseError) {
      field.error = e
    }
    else {
      throw e
    }
  }
  return field
}

const createPieceTokens = (tokens: Token[]): PieceToken[] => {
  const fileLetters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  let currentRank = 8
  let fileIndex = 0
  const pieceTokens: PieceToken[] = []
  for (const token of tokens) {
    if (isSlash(token)) {
      currentRank = currentRank - 1
      fileIndex = 0
    }
    else if (isDigit(token)) {
      fileIndex = fileIndex + Number(token.value)
    }
    else {
      fileIndex = fileIndex + 1
      pieceTokens.push({...token, rank: currentRank, file: fileLetters[fileIndex - 1]})
    }
  }
  return pieceTokens
}

const createPieces = (tokens: PieceToken[]): Piece[] => {
  const pieceTypes: PieceTypes = {
    p: 'Pawn', n: 'Knight', r: 'Rook', b: 'Bishop', k: 'King', q: 'Queen'
  }
  return tokens.map(token => ({
    position: `${token.rank}${token.file}`,
    color: token.value.match(whitePiecePattern) ? 'white' : 'black',
    type: pieceTypes[token.value.toLowerCase() as keyof PieceTypes]
  }))
}

export const parsePieceField = (field: Field): Piece[]  => {
  const pieceTokens: PieceToken[] = createPieceTokens(field.tokens)
  return createPieces(pieceTokens)
}
