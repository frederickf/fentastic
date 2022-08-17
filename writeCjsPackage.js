import { writeFileSync } from 'node:fs';

writeFileSync('./dist/cjs/package.json', '{\n  "type": "commonjs"\n}')