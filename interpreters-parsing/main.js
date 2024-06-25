import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Lexer from './lexer.js';
import Parser, { printAST } from './parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filepath = path.join(__dirname, 'main.lua');
const sourceCode = fs.readFileSync(filepath, 'utf8');

try {
    const lexer = new Lexer(sourceCode);
    const tokenList = lexer.scanTokens();
    //console.log(tokenList);

    const parser = new Parser(tokenList);
    const ast = parser.parse();
    printAST(ast);
} catch (e) {
    console.log(e);
}