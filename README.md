# fenjs
JavaScript library for parsing Forsyth-Edwards Notiation (FEN)

## Installation

```
npm install fenjs
```

## About



## Usage

Use the parseFen function to evaluate a FEN string. If valid, a object representing each field will be returned. If invalid, an object containing a detailed error message will be return. You can differentiate between the two using the `valid` boolean property.

```
import { parseFen } from 'fenjs'
const result = parseFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')

if (!result.valid) {
  //  There was a problem with the FEN string  
}
```

### Valid result
```
{
  fen: string 
  valid: true, 
  piecePlacement: [
    {
      position: string,
      color: string,
      type: string 
    },
    ...
  ],
  activeColor: string,
  castlingAvailability: undefined | {
    whiteKing: boolean,
    whiteQueen: boolean,
    blackKing: boolean,
    blackQueen: boolean
  },
  enPassantTargetSquare: string | undefined,
  halfMoveClock: number,
  fullMoveNumber: number
}

```
### Invalid result
```
{
  fen: string,
  valid: false,
  error: {
    message: string,
    position: number
  }
}
```
## References
* https://ia902908.us.archive.org/26/items/pgn-standard-1994-03-12/PGN_standard_1994-03-12.txt
  * Section "16.1: FEN"
* https://www.chess.com/terms/fen-chess