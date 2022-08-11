import { whitePiecePattern, blackPiecePattern } from './patterns.js'
import { type Token, isDigit, isSlash, isAlpha } from './token.js'

type PieceToken = Token & {
  rank: number;
  file: string;
}

type Piece = {
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

const validate = (tokens: Token[]) => {
  if (isSlash(tokens[0])) {
    throw new Error(`Invalid character. Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "${tokens[0].value}" at ${tokens[0].position}`)
  }
  let fileCount = 0
  let rankCount = 1
  for (let i = 0, n = 1; i < tokens.length; i++, n++) {
    let currentToken = tokens[i]
    let nextToken = n < tokens.length ? tokens[n] : undefined
    // Validate the current token type and update counts
    if (isDigit(currentToken)) {
      if (nextToken && isDigit(nextToken)) {
        throw new Error(`Invalid character. Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "/", instead found "${nextToken.value}" at ${nextToken.position}.`)
      }
      let currentTokenValue = Number(currentToken.value)
      if (currentTokenValue < 1 || currentTokenValue > 8) {
        throw new Error (`Invalid character. Numbers must be between 1-8, instead found "${currentToken.value}" at ${currentToken.position}`)
      }
      fileCount = fileCount + currentTokenValue
    } 
    else if (isAlpha(currentToken)) {
      if (!currentToken.value.match(whitePiecePattern) && !currentToken.value.match(blackPiecePattern)) {
        throw new Error(`Invalid character. Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found "${currentToken.value}" at ${currentToken.position}`)
      }
      fileCount = fileCount + 1
    }
    else if (isSlash(currentToken)) {
      if (nextToken && isSlash(nextToken)) {
        throw new Error(`Invalid character. Expected "p|r|n|b|q|k|P|R|N|B|Q|K" or "1-8", instead found "/" at ${nextToken.position}`)
      }
      // We know this must be slash because we validated the current token type already
      rankCount = rankCount + 1
      if (fileCount !== 8 ) {
        throw new Error(`Invalid file count. Expected "8", but found "${fileCount}" at ${currentToken.position}`)
      }
      fileCount = 0
    }
    else {
      throw new Error(`Invalid character. Expected "p|r|n|b|q|k|P|R|N|B|Q|K", "1-8" or "/", instead found "${currentToken.value}" at ${currentToken.position}`)
    }
    if (fileCount > 8) {
      throw new Error(`Invalid file count. Value must not exceed "8", instead found "${fileCount}" at ${currentToken.position}`)
    }
  }
  if (rankCount !== 8) {
    throw new Error(`Invalid rank count. Value must be "8", instead found "${rankCount}" in piece placement field.`)
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
