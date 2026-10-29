import {lessons} from './dist/lessons.js';
import {mkdirSync,writeFileSync} from 'node:fs';
mkdirSync('examples',{recursive:true});
for(const l of lessons)writeFileSync(`examples/${l.id}.${l.extension}`,l.code+'\n');
