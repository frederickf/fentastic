# fenjs
JavaScript library for parsing Forsyth-Edwards Notiation (FEN)

## Installation

```
npm install fenjs
```

## About fenjs

There are other FEN parsers and validators, and it's not really that difficult to write one. Split on white space, split the piece placement field on "/", then apply few regexs to each field and you're done. While this is a perfectly valid approach, it is missing something: detailed error messages that identify why the FEN is invalid, including the expected characters, the characters found to be invalid and the location in the string where the error was found. fenjs provides those error messages. 


## Usage

Use the `validateFen()` or `parseFen()` to evaluate a FEN string. Both will validate the FEN based on the FEN standard and return an object with a boolean valid key. `parseFen() will also return structured data describing the FEN (see Valid results section below)

```
// require is also supported
import { validateFen, parseFen } from 'fenjs'

// Use parseFen(str) or validateFen(str)
const result = parseFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')

if (result.valid) {
  // The FEN is valid
  // See the Valid result section below to learn about the keys on a valid result
}
else {
  // There is a problem with FEN
  // See the Invalid result section below to learn about the keys on a valid result 
}
```

### Valid result
| Header | Header |
| - | - |
| validateFen | A valid result will be an object consisting of the input fen and `valid: true`
| parseFen | A valid result will be an object consisting of the input fen, `valid: true` and keys with names based on the FEN fields defined in PGN_standard Section "16.1: FEN |

```
{
  fen: string 
  valid: true,
  // Following are for parseFen() only
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
Both `validateFen()` and `parseFen()` return the same result:
```
{
  fen: string,
  valid: false,
  errors: [
    {
      message: string,
      position: number
    },
    ...
  ]
}
```
## References
* https://ia902908.us.archive.org/26/items/pgn-standard-1994-03-12/PGN_standard_1994-03-12.txt
  * Section "16.1: FEN"
* https://www.chess.com/terms/fen-chess