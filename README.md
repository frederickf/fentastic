# fentastic
Fentastic is scientifically proven to improve your mental health, enhance your relationships, increase your range of motion, foster mental well being, and validate and parse Forsyth–Edwards Notation (FEN) used to describe a particular board position of a chess game.

## Installation

```
npm install fentastic
```
Pre 1.x.x versions of fentastic have been shown to cause headaches, insomnia, and breaking changes. Use `--save-exact` minimize side effects.

## About

Fentastic provides excessively detailed error messages including the field in which the error occurred, the expected characters, the characters found to be invalid and the location in the FEN string where the error was found. Fentastic can also be used to create a JavaScript representation of a FEN, if that's what you're into.

## Usage

Use the `validateFen()` or `parseFen()` functions to evaluate a FEN string. Both will validate the FEN string based on the FEN standard and return an object with a boolean valid key and errors if the FEN string is invalid. `parseFen()` will also return structured data describing a valid FEN string (see Valid results section below).

```
// CommonJS is also supported
import { validateFen, parseFen } from 'fentastic'

// Use parseFen(str) or validateFen(str)
const result = parseFen('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')

if (result.valid) {
  // The FEN is valid
  // See the Valid result section below to learn about the keys on a valid result
}
else {
  // There is a problem with FEN
  // See the Invalid result section below to learn about the keys on an invalid result 
}
```
### Options
`parseFen()` takes an optional options object as it's second argument. Currently only one option is supported:

#### correctWhiteSpace
Prior to validation and parsing, white space will be trimmed from the FEN string, and whitespace separating fields will be collapsed to a single space.
```
parseFen('  rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w   KQkq - 0 1 ', {
  correctWhiteSpace: true
})
```
In the example above, the FEN string would be considered valid and correctly parsed. Note that the input string will be returned unchanged. You will need to rely on the parsed results. 

## Fentastic results
By this point you should already be seeing fentastic results, including increased confidence, lower cholesterol and better skin.

### Valid
| Function | Description |
| - | - |
| `validateFen()` | A valid result will be an object consisting of the input fen and `valid: true`
| `parseFen()` | A valid result will be an object consisting of the input fen, `valid: true` and keys with names based on the FEN fields defined in PGN_standard Section "16.1: FEN |

```
{
  fen: string 
  valid: true,
  // Following are for parseFen() only
  fields: string[],
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
    whiteKingside: boolean,
    whiteQueenside: boolean,
    blackKingside: boolean,
    blackQueenside: boolean
  },
  enPassantTargetSquare: string | undefined,
  halfmoveClock: number,
  fullmoveNumber: number
}

```
### Invalid
Both `validateFen()` and `parseFen()` return the same result:
```
{
  fen: string,
  valid: false,
  errors: [
    {
      message: string,
      index: number
    },
    ...
  ]
}
```
## References
* https://ia902908.us.archive.org/26/items/pgn-standard-1994-03-12/PGN_standard_1994-03-12.txt
  * Section "16.1: FEN"
* https://www.chess.com/terms/fen-chess