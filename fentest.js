import { parseFen, validateFen } from './dist/esm/index.js'

const commands = {
  parse: parseFen,
  validate: validateFen
}

console.log(commands[process.argv[2]](process.argv[3]))
