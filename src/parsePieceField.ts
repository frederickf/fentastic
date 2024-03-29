import { type Token, tokenIs } from './token.js'
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
type Ranks = [TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup, TokenGroup]

const isSlash = tokenIs(/\//)
const isDigit = tokenIs(/[1-8]/)
const isAlpha = tokenIs(/[pnbrkq]/i)
const whitePiecePattern = /[PNBRKQ]/g


const fieldName = 'Piece placement data'

const tokensMustExist = (field: Field): void => {
  const tokens: Token[] = field.tokens
  if (!tokens.length) {
    throw new ParseError(fieldName, '',field.delimiter.index, 'p|r|n|b|q|k|P|R|N|B|Q|K|1-8')
  }
}

const mustNotStartWithSlash = (field: Field) => {
  const tokens: Token[] = field.tokens
  if (isSlash(tokens[0])) {
    throw new ParseError(fieldName, tokens[0].value, tokens[0].index, 'p|r|n|b|q|k|P|R|N|B|Q|K|1-8')
  }
}

const mustNotEndWithSlash = (field: Field): void => {
  const tokens: Token[] = field.tokens
  const lastIndex = tokens.length - 1
  if (isSlash(tokens[lastIndex])) {
    throw new ParseError(fieldName, '/', tokens[lastIndex].index) 
  }
}

const createRanks = (tokens: Token[]): Ranks => {
  const tokenGroups: TokenGroup[] = createTokenGroups(isSlash, tokens)
  if (tokenGroups.length !== 8) {
    throw new ParseError(
      fieldName, tokenGroups.length, tokenGroups[tokenGroups.length -1].delimiter.index, '8', 'rank count to be', 'count'
    )
  }
  return tokenGroups as Ranks
}

const rankMustNotBeEmpty = (rank: Rank): void => {
  if (!rank.tokens.length) {
    throw new ParseError(fieldName, '/', rank.delimiter.index + 1, 'p|r|n|b|q|k|P|R|N|B|Q|K|1-8')
  }
}

const validateTokens = (rank: Rank): void => {
  for (let i = 0; i < rank.tokens.length; i++) {
    const currentToken: Token = rank.tokens[i]
    if (!isAlpha(currentToken) && !isDigit(currentToken)) {
      throw new ParseError(fieldName, currentToken.value, currentToken.index, 'p|r|n|b|q|k|P|R|N|B|Q|K|1-8')
    }
  }
}

const validateNextDigit = (rank: Rank): void => {
  for (let i = 0; i < rank.tokens.length; i++) {
    const currentToken: Token = rank.tokens[i]
    const nextToken: Token = rank.tokens[i + 1]
    if (isDigit(currentToken) && nextToken && isDigit(nextToken)) {
      throw new ParseError(fieldName, nextToken.value, nextToken.index, 'p|r|n|b|q|k|P|R|N|B|Q|K')
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
      throw new ParseError(fieldName, fileCount, token.index, '8', 'file count to not exceed', 'count')
    }
    if (i === rank.tokens.length - 1 && fileCount !== 8 ) {
      throw new ParseError(fieldName, fileCount, token.index, '8', 'file count to be', 'count')
    }
  }
}

export const validatePieceField = (field: Field): Field => {
  try {
    // TODO: I don't think it is possible to get this far without tokens
    // now that there is an upstream test for empty input string
    tokensMustExist(field)
    mustNotStartWithSlash(field)
    mustNotEndWithSlash(field)
    const ranks: Ranks = createRanks(field.tokens)
    for (const rank of ranks) {
      rankMustNotBeEmpty(rank)
      validateTokens(rank)
      validateNextDigit(rank)
      validateFileCount(rank)
    }
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
