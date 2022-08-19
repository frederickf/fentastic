import { whitePiecePattern, blackPiecePattern } from './patterns.js'
import { type Token, isDigit, isSlash, isAlpha } from './token.js'
import { ParseError } from './ParseError.js'

type PieceToken = Token & {
  rank: number;
  file: string;
}

export type Piece = {
  position: string,
  color: 'white'|'black',
  type: string
}

type PieceTypes = {
  p: 'Pawn';
  n: 'Knight';
  r: 'Rook';
  b: 'Bishop';
  k: 'King';
  q: 'Queen';
}

const fieldName = 'Piece placement data'

const validate = (tokens: Token[]) => {
  if (isSlash(tokens[0])) {
    throw new ParseError(
      `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "${tokens[0].value}" at ${tokens[0].position}`,
      tokens[0].position
    )
  }
  let fileCount = 0
  // We establised that we have at least one rank due to the existence of tokens
  let rankCount = 1
  // This needs a default value to account for no slashes
  let lastSlashIndex = tokens.length - 1
  for (let i = 0, n = 1; i < tokens.length; i++, n++) {
    let currentToken = tokens[i]
    let nextToken = n < tokens.length ? tokens[n] : undefined

    // Validate the current token type and update counts
    if (isDigit(currentToken)) {
      if (nextToken && isDigit(nextToken)) {
        throw new ParseError(
          `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "/", instead found "${nextToken.value}" at ${nextToken.position}.`,
          nextToken.position
        )
      }
      let currentTokenValue = Number(currentToken.value)
      if (currentTokenValue < 1 || currentTokenValue > 8) {
        throw new ParseError(
          `${fieldName}: Numbers must be between 1-8, instead found "${currentToken.value}" at ${currentToken.position}`,
          currentToken.position
        )
      }
      fileCount = fileCount + currentTokenValue
    } 
    else if (isAlpha(currentToken)) {
      if (!currentToken.value.match(whitePiecePattern) && !currentToken.value.match(blackPiecePattern)) {
        throw new ParseError(
          `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found "${currentToken.value}" at ${currentToken.position}`,
          currentToken.position
        )
      }
      fileCount = fileCount + 1
    }
    else if (isSlash(currentToken)) {
      if (nextToken && isSlash(nextToken)) {
        throw new ParseError(
          `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "/" at ${nextToken.position}`,
          nextToken.position
        )
      }
      if (fileCount !== 8 ) {
        throw new ParseError(
          `${fieldName}: Expected file count of "8", instead found "${fileCount}" at ${currentToken.position}`,
          currentToken.position
        )
      }
      fileCount = 0
      rankCount = rankCount + 1
      lastSlashIndex = i
    }
    else {
      throw new ParseError(
        `${fieldName}: Expected "p|r|n|b|q|k|P|R|N|B|Q|K", "1-8" or "/", instead found "${currentToken.value}" at ${currentToken.position}`,
        currentToken.position
      )
    }

    if (fileCount > 8) {
      throw new ParseError(
        `${fieldName}: File count must not exceed "8", instead found "${fileCount}" at ${currentToken.position}`,
        currentToken.position
      )
    }

    if (i === tokens.length - 1) {
      // This is necessary because the last rank does not end with a /
      if (fileCount !== 8 ) {
        throw new ParseError(
          `${fieldName}: Expected file count of "8", instead found "${fileCount}" at ${currentToken.position}`,
          currentToken.position
        )
      }
    }
  }
  if (rankCount !== 8) {
    throw new ParseError(
      `${fieldName}: Expected rank count of "8", instead found "${rankCount}" at ${tokens[lastSlashIndex].position}.`,
      tokens[lastSlashIndex].position
    )
  }
  return tokens
}

const createPieceTokens = (tokens: Token[]): PieceToken[] => {
  const fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  let currentRank = 8
  let fileIndex = 0;
  const pieceTokens: PieceToken[] = []
  for (let token of tokens) {
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
  let pieces: Piece[] = []
  for (let token of tokens) {
    pieces.push({
      position: `${token.rank}${token.file}`,
      color: token.value.match(whitePiecePattern) ? 'white' : 'black',
      type: pieceTypes[token.value.toLowerCase() as keyof PieceTypes]
    })
  }
  return pieces
}

export const parsePieceField = (field: Token[]) => {
  const validTokens = validate(field)
  const pieceTokens = createPieceTokens(validTokens)
  return createPieces(pieceTokens)
}
