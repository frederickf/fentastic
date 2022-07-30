import { parseFen } from './src/fen.js'

console.log('input', process.argv[2])

try {
  console.log(parseFen(process.argv[2]))
}
catch(e) {
  console.log(e)
}
