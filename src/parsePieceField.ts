import { isDigit, isSlash, isAlpha } from './tokenTypes.js'
import { whitePiecePattern, blackPiecePattern } from './patterns.js'
import { Token } from './createTokens.js'

type PieceToken = Token & {
  rank: number;
  file: string;
}

type Piece = {
  position: string,
  color: 'white'|'black',
  type: string
}

type NextValid = {
  digit: string[];
  alpha: string[];
  slash: string[];
}

type PieceTypes = {
  p: 'Pawn';
  n: 'Knight';
  r: 'Rook';
  b: 'Bishop';
  k: 'King';
  q: 'Queen';
}


const pieceTypes: PieceTypes = {
  p: 'Pawn',
  n: 'Knight',
  r: 'Rook',
  b: 'Bishop',
  k: 'King',
  q: 'Queen'
}

const nextValidMap: NextValid = {
  digit: ['alpha', 'slash'],
  alpha: ['alpha', 'digit', 'slash'],
  slash: ['alpha', 'digit']
}

const fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const isWhite = (value: string) => value.match(whitePiecePattern)

const isBlack = (value: string) => value.match(blackPiecePattern)


const validate = (tokens: Token[]) => {
  let fileCount = 0
  let rankCount = 1
  for (let i = 0, n = 1; i < tokens.length; i++, n++) {
    let currentToken = tokens[i]
    let nextToken = n < tokens.length ? tokens[n] : undefined

    // Validate the current token type and update counts
    if (isDigit(currentToken.type)) {
      let currentTokenValue = Number(currentToken.value)
      if (currentTokenValue < 1 || currentTokenValue > 8) {
        throw new Error (`Invalid character at ${currentToken.position}. Numbers must be between 1 to 8, found "${currentToken.value}"`)
      }
      fileCount = fileCount + currentTokenValue
    }
    else if (isAlpha(currentToken.type)) {
      if (!isWhite(currentToken.value) && !isBlack(currentToken.value)) {
        throw new Error(`Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found "${currentToken.value}" at ${currentToken.position}`)
      }
      fileCount = fileCount + 1
    }
    else if (isSlash(currentToken.type)) {
      // We know this must be slash because we validated the current token type already
      rankCount = rankCount + 1
      fileCount = 0
    }
    else {
      throw new Error(`Invalid character at ${currentToken.position}. Expected letter, number or slash, instead found "${currentToken.value}"`)
    }

    // Confirm next character is valid for the current one
    let nextValid = nextValidMap[currentToken.type as keyof NextValid]
    if (nextToken && !nextValid.includes(nextToken.type)) {
      throw new Error (`Invalid character at ${currentToken.position}. Expected ${nextValid.join('|')} instead found "${currentToken.value}" at ${currentToken.position}`)
    }

    if (fileCount > 8) {
      throw new Error(`File value ${fileCount} must not exceed 8 at ${currentToken.position}`)
    }
  }
  
  if (rankCount !== 8) {
    throw new Error(`Rank count ${rankCount} should be 8 in pieces field`)
  }

  return tokens
}

const createPieceTokens = (tokens: Token[]): PieceToken[] => {
  let currentRank = 8
  let fileIndex = 0;
  const pieceTokens: PieceToken[] = []
  for (let token of tokens) {
    if (!isSlash(token.type)) {
      fileIndex = isDigit(token.type) ? fileIndex + Number(token.value) : fileIndex + 1
      if (!isDigit(token.type)) {
        pieceTokens.push({...token, rank: currentRank, file: fileLetters[fileIndex - 1]})
      }
    }

    if (isSlash(token.type)) {
      currentRank = currentRank - 1
      fileIndex = 0
    }
  }
  return pieceTokens
}

const createPieces = (tokens: PieceToken[]): Piece[] => {
  let pieces: Piece[] = []
  for (let token of tokens) {
    // We already validated color, so we know if not white, then black
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
