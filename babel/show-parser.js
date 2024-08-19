import { parse } from '@babel/parser';

const source = `
console.log('Hello, World!');
`;

const AST = parse(source);
console.log(JSON.stringify(AST, null, 4));
