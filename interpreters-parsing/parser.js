import { Token, tokenType, reservedKeywords } from './token.js';

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        return this.chunk();
    }

    chunk() {
        const blockNode = this.block();
        return { type: 'Chunk', block: blockNode };
    }

    block() {
        const statements = [];
        while (!this.check('return') && !this.check('end') && !this.isAtEnd()) {
            statements.push(this.statement());
        }
        const returnStatement = this.returnStatement();
        return { type: 'Block', statements, returnStatement };
    }

    statement() {
        if (this.check('if')) {
            return this.ifStatement();
        } else if (this.check('while')) {
            return this.whileStatement();
        } else if (this.check('repeat')) {
            return this.repeatStatement();
        } else if (this.check('for')) {
            return this.forStatement();
        } else if (this.check('local')) {
            return this.localStatement();
        } else if (this.check('function')) {
            return this.functionStatement();
        } else if (
            this.check('identifier') ||
            this.check('NUMBER') ||
            this.check('LEFT_PAREN')
        ) {
            return this.assignmentOrFunctionCallOrExpression();
        }
        throw new Error(`Unexpected token: ${this.currentToken().type}`);
    }

    ifStatement() {
        this.expect('if');
        const condition = this.expression();
        this.expect('then');
        const thenBlock = this.block();
        const elseIfClauses = [];
        while (this.match('elseif')) {
            const elseifCondition = this.expression();
            this.expect('then');
            const elseifBlock = this.block();
            elseIfClauses.push({
                condition: elseifCondition,
                block: elseifBlock,
            });
        }
        let elseBlock = null;
        if (this.match('else')) {
            elseBlock = this.block();
        }
        this.expect('end');
        return {
            type: 'IfStatement',
            condition,
            thenBlock,
            elseIfClauses,
            elseBlock,
        };
    }

    whileStatement() {
        this.expect('while');
        const condition = this.expression();
        this.expect('do');
        const body = this.block();
        this.expect('end');
        return { type: 'WhileStatement', condition, body };
    }

    repeatStatement() {
        this.expect('repeat');
        const body = this.block();
        this.expect('until');
        const condition = this.expression();
        return { type: 'RepeatStatement', condition, body };
    }

    forStatement() {
        this.expect('for');
        const identifier = this.expect('identifier').value;
        if (this.match('=')) {
            const start = this.expression();
            this.expect(',');
            const end = this.expression();
            const step = this.match(',') ? this.expression() : null;
            this.expect('do');
            const body = this.block();
            this.expect('end');
            return {
                type: 'ForNumericStatement',
                identifier,
                start,
                end,
                step,
                body,
            };
        } else {
            const identifiers = this.identifierList();
            this.expect('in');
            const expressions = this.expressionList();
            this.expect('do');
            const body = this.block();
            this.expect('end');
            return {
                type: 'ForGenericStatement',
                identifiers,
                expressions,
                body,
            };
        }
    }

    localStatement() {
        this.expect('local');
        if (this.check('function')) {
            this.expect('function');
            const identifier = this.expect('identifier').value;
            const body = this.functionBody();
            return { type: 'LocalFunctionStatement', identifier, body };
        } else {
            const variables = this.attrVarList();
            const expressions = this.match('=') ? this.expressionList() : null;
            return { type: 'LocalStatement', variables, expressions };
        }
    }

    functionStatement() {
        this.expect('function');
        const name = this.functionName();
        const body = this.functionBody();
        return { type: 'FunctionStatement', name, body };
    }

    assignmentOrFunctionCallOrExpression() {
        const expr = this.prefixExpression();
        if (this.match('=')) {
            const variables = [expr, ...this.variableListTail()];
            const expressions = this.expressionList();
            return { type: 'AssignmentStatement', variables, expressions };
        } else if (this.match('(') || this.match(':')) {
            const call = this.functionCallTail(expr);
            return { type: 'FunctionCallStatement', call };
        }
        return { type: 'ExpressionStatement', expression: expr };
    }

    returnStatement() {
        if (this.match('return')) {
            const expressions = this.expressionList();
            return { type: 'ReturnStatement', expressions };
        }
        return null;
    }

    // Expressions
    expression() {
        return this.logicalOr();
    }

    logicalOr() {
        let node = this.logicalAnd();
        while (this.match('or')) {
            const operator = this.previous();
            const right = this.logicalAnd();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    logicalAnd() {
        let node = this.comparison();
        while (this.match('and')) {
            const operator = this.previous();
            const right = this.comparison();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    comparison() {
        let node = this.bitwiseOr();
        while (this.match('==', '!=', '>', '>=', '<', '<=')) {
            const operator = this.previous();
            const right = this.bitwiseOr();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    bitwiseOr() {
        let node = this.bitwiseXor();
        while (this.match('|')) {
            const operator = this.previous();
            const right = this.bitwiseXor();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    bitwiseXor() {
        let node = this.bitwiseAnd();
        while (this.match('~')) {
            const operator = this.previous();
            const right = this.bitwiseAnd();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    bitwiseAnd() {
        let node = this.shift();
        while (this.match('&')) {
            const operator = this.previous();
            const right = this.shift();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    shift() {
        let node = this.concatenation();
        while (this.match('<<', '>>')) {
            const operator = this.previous();
            const right = this.concatenation();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    concatenation() {
        let node = this.term();
        while (this.match('..')) {
            const operator = this.previous();
            const right = this.concatenation();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    term() {
        let node = this.factor();
        while (this.match('+', '-')) {
            const operator = this.previous();
            const right = this.factor();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    factor() {
        let node = this.unary();
        while (this.match('*', '/', '//', '%')) {
            const operator = this.previous();
            const right = this.unary();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    unary() {
        if (this.match('-', 'not', '#', '~')) {
            const operator = this.previous();
            const right = this.unary();
            return { type: 'Unary', operator, right };
        }
        return this.power();
    }

    power() {
        let node = this.primary();
        while (this.match('^')) {
            const operator = this.previous();
            const right = this.power();
            node = { type: 'Binary', left: node, operator, right };
        }
        return node;
    }

    primary() {
        if (this.match('NUMBER', 'STRING', 'true', 'false', 'nil')) {
            return { type: 'Literal', value: this.previous().value };
        }
        if (this.match('function')) {
            return this.functionDef();
        }
        if (this.match('{')) {
            return this.table();
        }
        return this.prefixExpression();
    }

    prefixExpression() {
        if (this.match('identifier')) {
            return this.variable(this.previous());
        } else if (this.match('(')) {
            const expr = this.expression();
            this.expect(')');
            return { type: 'Grouping', expression: expr };
        }
        throw new Error(
            `Unexpected token in prefix expression: ${this.currentToken().type}`,
        );
    }

    variable(token) {
        let node = { type: 'Variable', name: token.lexeme };
        while (true) {
            if (this.match('[')) {
                const index = this.expression();
                this.expect(']');
                node = { type: 'Index', table: node, index };
            } else if (this.match('.')) {
                const property = this.expect('identifier').lexeme;
                node = { type: 'PropertyAccess', object: node, property };
            } else if (this.match(':')) {
                const method = this.expect('identifier').lexeme;
                const args = this.arguments();
                node = { type: 'MethodCall', receiver: node, method, args };
            } else {
                break;
            }
        }
        return node;
    }

    expressionList() {
        const expressions = [];
        do {
            expressions.push(this.expression());
        } while (this.match(','));
        return expressions;
    }

    // Utility methods
    match(...types) {
        for (let type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    expect(type) {
        const token = this.match(type);
        if (!token) {
            throw new Error(
                `Expected token type ${type} but got ${this.currentToken().type}`,
            );
        }
        return token;
    }

    check(type) {
        return this.currentToken() && this.currentToken().type === type;
    }

    advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    currentToken() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.currentToken().type === 'EOF';
    }
}

export default Parser;
