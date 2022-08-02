import { isDigit, isSlash, isAlpha, isTokenDigit } from './tokenTypes.js'
import { whitePiecePattern, blackPiecePattern } from './patterns.js'
import { Token } from './createTokens.js'

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

const isLast = (tokenCount: number, tokenPosition: number): boolean => tokenCount === (tokenPosition)

const isWhite = (value: string) => value.match(whitePiecePattern)

const isBlack = (value: string) => value.match(blackPiecePattern)


const validate = (tokens: Token[]) => {
  let fileCount = 0
  let rankCount = 1
  for (let i = 0, n = 1; i < tokens.length; i++, n++) {
    let currentToken = tokens[i]
    let nextToken = n < tokens.length ? tokens[n] : undefined

    // Validate the current token type and update counts
    if (isDigit(currentToken.type) && typeof currentToken.value === 'number') {
      if (currentToken.value < 1 || currentToken.value > 8) {
        throw new Error (`Invalid character at ${currentToken.position}. Numbers must be between 1 to 8, found "${currentToken.value}"`)
      }
      fileCount = fileCount + currentToken.value
    }
    else if (isAlpha(currentToken.type) && typeof currentToken.value === 'string') {
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

const createRanks = (pieceTokens: Token[]): Token[][] => {
  let currentRank = 8
  const ranks: Token[][] = []
  let rank: Token[] = []
  for (let token of pieceTokens) {
    if (!isSlash(token.type)) {
      // This will result in digit tokens getting a rank letter, but that's ok
      token.rank = currentRank
      rank.push(token)
    }

    if (isSlash(token.type) || isLast(pieceTokens.length, token.position)) {
      ranks.push(rank)
    }

    if (isSlash(token.type)) {
      currentRank = currentRank - 1
      rank = []
    }
  }

  // if (ranks.length !== 8) {
  //   throw new Error(`Rank count ${ranks.length} should be 8 in pieces field`)
  // }

  return ranks
}


// Adds file to piece token and return array of only piece tokens, no digits
const addFileToPieceToken = (rank: Token[]): Token[] => { 
  let fileIndex = 0;
  const pieceTokens: Token[] = []
  let token: Token
  for (token of rank) {
    if (isDigit(token.type)) {
      fileIndex = fileIndex + <number>token.value
    }
    else {
      fileIndex = fileIndex + 1
    }

    // if (fileIndex > 8) {
    //   throw new Error(`File value ${fileIndex} must not exceed 8 at ${token.position}`)
    // }

    if (!isDigit(token.type)) {
      token.file = fileLetters[fileIndex - 1]
      pieceTokens.push(token)
    }
  }
  // if (fileIndex < 8) {
  //   throw new Error(`File value ${fileIndex} must equal 8 at ${token.position}`)
  // }
  return pieceTokens
}

const parseRanks = (ranks: Token[][]): Token[] => {
  let pieceTokens: Token[] = []
  for (let rank of ranks) {
    pieceTokens = pieceTokens.concat(addFileToPieceToken(rank))
  }
  return pieceTokens
}

const createPieces = (pieceTokens: Token[]) => {
  let pieces = []
  for (let token of pieceTokens) {
    let piece: Partial<Piece> = {
      position: `${token.rank}${token.file}`
    }
    
    let tokenValue: string = <string> token.value;
    if (tokenValue.match(whitePiecePattern)) {
      piece.color = 'white'
    }
    else {
      // We already validated color, so we know if not white, then black
      piece.color = 'black'
    }
    // else {
    //   throw new Error(`Expected "p|r|n|b|q|k|P|R|N|B|Q|K", instead found ${token.value} at ${token.position}`)
    // }
    piece.type = pieceTypes[tokenValue.toLowerCase() as keyof PieceTypes]
    pieces.push(piece)
  }
  return pieces
}

export const parsePieceField = (pieceFieldTokens: Token[]) => {
  const validTokens = validate(pieceFieldTokens)
  const ranks = createRanks(validTokens)
  const pieceTokens = parseRanks(ranks)
  return createPieces(pieceTokens)
}
