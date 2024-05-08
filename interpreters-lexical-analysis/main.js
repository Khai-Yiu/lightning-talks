import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Lexer from './lexer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filepath = path.join(__dirname, 'main.lua');
const sourceCode = fs.readFileSync(filepath, 'utf8');
const outputPath = path.join(__dirname, 'tokenOutput.txt');

const lexer = new Lexer(sourceCode);
const tokenList = lexer.scanTokens();

const stringifiedTokenList = tokenList.map((token) => token.toString());
fs.writeFile(outputPath, stringifiedTokenList.join('\n'), () => {});

console.log('Tokens added to outputFile.txt');
