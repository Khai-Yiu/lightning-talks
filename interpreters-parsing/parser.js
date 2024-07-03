class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    parse() {
        return this.chunk();
    }

    chunk() {
        const block = this.block();

        return { type: 'Chunk', block };
    }

    block() {
        const node = { type: 'Block', statements: [] };
        const statements = [];

        while (
            !this.check('RETURN') &&
            !this.check('END') &&
            !this.check('ELSEIF') &&
            !this.check('ELSE') &&
            !this.check('UNTIL') &&
            !this.isAtEnd()
        ) {
            node.statements.push(this.statement());
            this.match('SEMICOLON');
        }

        if (this.match('RETURN')) {
            node.returnStatement = this.returnStatement;
        }

        return node;
    }

    statement() {
        const tokenType = this.peek().type;

        switch (tokenType) {
            case 'IF':
                return this.ifStatement();
            case 'WHILE':
                return this.whileStatement();
            case 'REPEAT':
                return this.repeatStatement();
            case 'FOR':
                return this.forStatement();
            case 'LOCAL':
                return this.localStatement();
            case 'FUNCTION':
                return this.functionStatement();
            case 'BREAK':
                return this.breakStatement();
            default:
                if (
                    this.check('IDENTIFIER') &&
                    (this.checkNext('LEFT_PAREN') || this.checkNext('COLON'))
                ) {
                    const currentToken = this.advance();

                    return this.functionCallStatement(currentToken);
                } else if (this.isAssignment()) {
                    return this.assignmentStatement();
                } else if (this.check('IDENTIFIER')) {
                    return this.prefixExpression();
                } else {
                    throw new Error(
                        `Line ${this.peek().line}: Unexpected token: ${tokenType}`,
                    );
                }
        }
    }

    returnStatement() {
        this.advance();

        const expressions = this.expressionList();
        this.match('SEMICOLON');

        return { type: 'ReturnStatement', expressions };
    }

    breakStatement() {
        this.advance();
        this.match('SEMICOLON');

        return { type: 'BreakStatement' };
    }

    ifStatement() {
        const node = {
            type: 'IfStatement',
            clauses: [],
        };
        this.advance();

        node.clauses.push(this.ifBlock());

        if (this.check('ELSEIF')) {
            node.clauses.push(...this.elseIfBlock());
        }

        if (this.check('ELSE')) {
            node.clauses.push(this.elseBlock());
        }

        this.consume('END', 'Expected "end" after "if" statement.');

        return node;
    }

    ifBlock() {
        const clause = { type: 'IfClause' };

        if (this.match('LEFT_PAREN')) {
            clause.condition = this.expression();
            this.consume('RIGHT_PAREN', 'Expected ")" after "if" condition.');
        } else {
            clause.condition = this.expression();
        }

        this.consume('THEN', 'Expected "then" after "if" condition.');
        clause.block = this.block();

        return clause;
    }

    elseIfBlock() {
        const clauses = [];

        while (this.match('ELSEIF')) {
            const clause = { type: 'ElseIfClause' };

            if (this.match('LEFT_PAREN')) {
                clause.condition = this.expression();
                this.consume(
                    'RIGHT_PAREN',
                    'Expected ")" after "elseif" condition.',
                );
            } else {
                clause.condition = this.expression();
            }

            this.consume('THEN', 'Expected "then" after  "elseif" condition.');
            clause.block = this.block();

            clauses.push(clause);
        }

        return clauses;
    }

    elseBlock() {
        const clause = { type: 'ElseClause' };

        this.advance();
        clause.block = this.block();

        return clause;
    }

    whileStatement() {
        const node = { type: 'WhileStatement' };
        this.advance();

        if (this.match('LEFT_PAREN')) {
            node.condition = this.expression();
            this.consume(
                'RIGHT_PAREN',
                'Expected ")" after "while" condition.',
            );
        } else {
            node.condition = this.expression();
        }

        this.consume('DO', 'Expected "do" after "while" condition.');
        node.block = this.block();
        this.consume('END', 'Expected "end" after while statement.');

        return node;
    }

    repeatStatement() {
        const node = { type: 'RepeatStatement' };
        this.advance();
        node.block = this.block();
        this.consume('UNTIL', 'Expected "until" after "repeat" body.');

        if (this.match('LEFT_PAREN')) {
            node.condition = this.expression();
            this.consume(
                'RIGHT_PAREN',
                'Expected ")" after "until" condition.',
            );
        } else {
            node.condition = this.expression();
        }

        return node;
    }

    forStatement() {
        this.advance();

        if (this.check('IDENTIFIER') && this.checkNext('ASSIGN')) {
            const variable = this.advance();
            this.advance();

            const initialValue = this.expression();
            this.consume('COMMA', 'Expected "," after start value.');

            const finalValue = this.expression();
            const stepValue = this.match('COMMA') ? this.expression() : 1;

            this.consume('DO', 'Expected "do" after "for" clauses.');
            const block = this.block();
            this.consume('END', 'Expected "end" after "for" statement.');

            return {
                type: 'ForNumericStatement',
                variable: { type: variable.type, name: variable.lexeme },
                initialValue,
                finalValue,
                stepValue,
                block,
            };
        } else if (this.check('IDENTIFIER')) {
            const variables = this.identifierList();
            this.consume('IN', 'Expected "in" after "for" variables.');
            const expressions = this.expressionList();
            this.consume('DO', 'Expected "do" after "for" expressions.');
            const block = this.block();
            this.consume('END', 'Expected "end" after "for" statement.');

            return {
                type: 'ForGenericStatement',
                variables,
                expressions,
                block,
            };
        }

        throw new Error(
            `Line ${this.peek().line}: Unexpected token: ${this.peek().type}`,
        );
    }

    localStatement() {
        this.advance();

        if (this.match('FUNCTION')) {
            const name = this.consume(
                'IDENTIFIER',
                'Expected identifier after "function".',
            ).lexeme;
            const body = this.functionBody();
            this.consume(
                'END',
                'Expected "end" after "local function" statement.',
            );

            return {
                type: 'LocalFunctionStatement',
                name,
                body,
            };
        } else if (this.check('IDENTIFIER')) {
            const variables = this.attrVarList();
            const expressions = this.match('ASSIGN')
                ? this.expressionList()
                : [];

            return { type: 'LocalStatement', variables, expressions };
        }

        throw new Error(
            `Line ${this.peek().line}: Unexpected token: ${this.peek().type}`,
        );
    }

    functionStatement() {
        this.advance();

        if (this.check('IDENTIFIER')) {
            const name = this.functionName();
            const body = this.functionBody();
            this.consume('END', 'Expected "end" after "function" statement.');

            return {
                type: 'FunctionStatement',
                name,
                body,
            };
        }

        throw new Error(
            `Line ${this.peek().line}: Unexpected token: ${this.peek().type}`,
        );
    }

    assignmentStatement() {
        const variables = this.variableList();
        this.consume('ASSIGN', 'Expected "=" after variable declarations.');
        const expressions = this.expressionList();

        return { type: 'AssignmentStatement', variables, expressions };
    }

    functionCallStatement(callee) {
        const node = { type: 'FunctionCall', callee };

        if (this.match('COLON')) {
            node.method = this.consume(
                'IDENTIFIER',
                'Expect method name after ":".',
            ).lexeme;
        }

        node.args = this.arguments();

        return node;
    }

    identifierList() {
        const identifiers = [];

        do {
            const currentIdentifier = this.consume(
                'IDENTIFIER',
                'Expected identifier in list.',
            );
            identifiers.push({
                type: 'Identifier',
                name: currentIdentifier.lexeme,
            });
        } while (this.match('COMMA') && this.check('IDENTIFIER'));

        return identifiers;
    }

    expressionList() {
        const expressions = [];

        do {
            expressions.push(this.expression());
        } while (this.match('COMMA'));

        return expressions;
    }

    functionName() {
        const node = {
            type: 'FunctionName',
        };

        node.name = this.consume(
            'IDENTIFIER',
            'Expected function name.',
        ).lexeme;

        if (this.check('PERIOD')) node.members = [];
        while (this.match('PERIOD')) {
            const member = this.consume(
                'IDENTIFIER',
                'Expected identifier after ".".',
            );
            node.members.push({
                type: member.type,
                name: member.lexeme,
            });
        }

        if (this.match('COLON')) {
            node.methodName = this.consume(
                'IDENTIFIER',
                'Expect identifier after ":".',
            );
        }

        return node;
    }

    functionBody() {
        this.consume('LEFT_PAREN', 'Expected "(" after function name.');
        const parameters = this.check('RIGHT_PAREN')
            ? []
            : this.parameterList();
        this.consume('RIGHT_PAREN', 'Expected "(" after function name.');
        const block = this.block();

        return { type: 'FunctionBody', parameters, block };
    }

    arguments() {
        if (this.match('LEFT_PAREN')) {
            if (this.match('RIGHT_PAREN')) {
                return [];
            }

            const args = this.expressionList();
            this.consume('RIGHT_PAREN', 'Expected ")" after expression.');

            return args;
        }

        throw new Error(
            `Line ${this.peek().line}: Unexpected token: ${this.peek().type}`,
        );
    }

    parameterList() {
        let node = { type: 'ParameterList', names: parameters };

        if (this.match('ELLIPSIS')) {
            node.parameters = [
                {
                    type: 'RestArgs',
                    name: '...',
                },
            ];
        } else {
            node.parameters = this.identifierList();

            if (this.match('ELLIPSIS')) {
                node.parameters.push({
                    type: 'RestArgs',
                    name: '...',
                });
            }
        }

        return node;
    }

    attrVarList() {
        const attributeVariables = [];

        do {
            const name = this.consume(
                'IDENTIFIER',
                'Expected identifier in list.',
            ).lexeme;

            if (this.match('LESS')) {
                const attribute = this.consume(
                    'IDENTIFIER',
                    'Expected identifier for attribute.',
                ).lexeme;
                this.consume('GREATER', 'Expected ">" after attribute.');
                attributeVariables.push({
                    type: 'Identifier',
                    name,
                    attribute,
                });
            } else {
                attributeVariables.push({ type: 'Identifier', name });
            }
        } while (this.match('COMMA') && this.check('IDENTIFIER'));

        return attributeVariables;
    }

    variableList() {
        const variables = [];

        do {
            variables.push(this.variable());
        } while (this.match('COMMA'));

        return variables;
    }

    variable() {
        let node;

        if (this.match('IDENTIFIER')) {
            node = { type: 'Identifier', name: this.previous().lexeme };
        } else {
            node = this.prefixExpression();
        }

        while (this.check('LEFT_BRACKET') || this.check('PERIOD')) {
            if (this.match('LEFT_BRACKET')) {
                const index = this.expression();
                this.consume('RIGHT_BRACKET', 'Expected "]" after index.');
                node = { type: 'Index', table: node, index };
            } else if (this.match('PERIOD')) {
                const property = this.consume(
                    'IDENTIFIER',
                    'Expected property name after ".".',
                ).lexeme;
                node = {
                    type: 'Property',
                    table: node,
                    property,
                };
            }
        }

        return node;
    }

    // Expressions
    expression() {
        return this.logicalOr();
    }

    logicalOr() {
        let node = this.logicalAnd();

        while (this.match('OR')) {
            const operator = this.previous().lexeme;
            const right = this.logicalAnd();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    logicalAnd() {
        let node = this.comparison();

        while (this.match('AND')) {
            const operator = this.previous().lexeme;
            const right = this.comparison();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    comparison() {
        let node = this.bitwiseOr();

        while (
            this.match(
                'EQUAL',
                'NOT_EQUAL',
                'GREATER',
                'GREATER_EQUAL',
                'LESS',
                'LESS_EQUAL',
            )
        ) {
            const operator = this.previous().lexeme;
            const right = this.bitwiseOr();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    bitwiseOr() {
        let node = this.bitwiseXor();

        while (this.match('PIPE')) {
            const operator = this.previous().lexeme;
            const right = this.bitwiseXor();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    bitwiseXor() {
        let node = this.bitwiseAnd();

        while (this.match('TILDA')) {
            const operator = this.previous().lexeme;
            const right = this.bitwiseAnd();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    bitwiseAnd() {
        let node = this.shift();

        while (this.match('AMPERSAND')) {
            const operator = this.previous().lexeme;
            const right = this.shift();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    shift() {
        let node = this.concatenation();

        while (this.match('LEFT_SHIFT', 'RIGHT_SHIFT')) {
            const operator = this.previous().lexeme;
            const right = this.concatenation();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    concatenation() {
        let node = this.term();

        while (this.match('CONCATENATE')) {
            const operator = this.previous().lexeme;
            const right = this.concatenation();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    term() {
        const node = this.factor();

        while (this.match('PLUS', 'MINUS')) {
            const operator = this.previous().lexeme;
            const right = this.factor();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    factor() {
        let node = this.unary();

        while (this.match('STAR', 'SLASH', 'DOUBLE_SLASH', 'PERCENT')) {
            const operator = this.previous().lexeme;
            const right = this.unary();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    unary() {
        if (this.match('MINUS', 'NOT', 'HASHTAG', 'TILDA')) {
            const operator = this.previous().lexeme;
            const right = this.unary();
            return { type: 'UnaryExpression', operator, right };
        }

        return this.power();
    }

    power() {
        let node = this.primary();

        while (this.match('CARAT')) {
            const operator = this.previous().lexeme;
            const right = this.power();
            node = { type: 'BinaryExpression', left: node, operator, right };
        }

        return node;
    }

    primary() {
        if (this.match('NUMBER', 'STRING', 'TRUE', 'FALSE', 'NIL')) {
            return { type: 'Literal', value: this.previous().value };
        }

        if (this.match('ELLIPSIS')) {
            return { type: 'VarArgs' };
        }

        if (this.check('FUNCTION')) {
            return this.functionDef();
        }

        if (this.check('LEFT_BRACE')) {
            return this.table();
        }

        return this.prefixExpression();
    }

    functionDef() {
        this.advance();
        const body = this.functionBody();
        this.consume('END', 'Expected "end" after function definition.');

        return body;
    }

    table() {
        this.advance();
        const fields = this.check('RIGHT_BRACE') ? [] : this.fieldList();
        this.consume('RIGHT_BRACE', 'Expected "}" after table definition.');

        return { type: 'TableConstructorExpression', fields };
    }

    fieldList() {
        const fields = [];

        do {
            fields.push(this.field());
        } while (
            this.match('COMMA', 'SEMICOLON') &&
            !this.check('RIGHT_BRACE')
        );

        return fields;
    }

    field() {
        if (this.match('LEFT_BRACKET')) {
            const key = this.expression();
            this.consume('RIGHT_BRACKET', 'Expected ] for field assignment.');
            this.consume('ASSIGN', 'Expected = for field assignment');
            const value = this.expression();

            return { type: 'TableField', key, value };
        } else if (this.match('IDENTIFIER')) {
            const key = this.previous().lexeme;
            this.consume('ASSIGN', 'Expected = for field assignment');
            const value = this.expression();

            return { type: 'TableField', key, value };
        } else {
            const value = this.expression();

            return { type: 'TableValueField', value };
        }
    }

    prefixExpression() {
        let expression;
        if (this.match('IDENTIFIER')) {
            expression = { type: 'Identifier', name: this.previous().lexeme };
        } else if (this.match('LEFT_PAREN')) {
            expression = this.expression();
            this.consume('RIGHT_PAREN', 'Expected ")" after expression.');
        } else {
            throw new Error(
                `Line ${this.peek().line}: Unexpected token: ${this.peek().type}`,
            );
        }

        while (
            this.check('LEFT_BRACKET') ||
            this.check('PERIOD') ||
            this.check('LEFT_PAREN') ||
            this.check('COLON')
        ) {
            if (this.match('LEFT_BRACKET')) {
                const index = this.expression();
                this.consume('RIGHT_BRACKET', 'Expected "]" after index.');
                expression = { type: 'Index', table: expression, index };
            } else if (this.match('PERIOD')) {
                const property = this.consume(
                    'IDENTIFIER',
                    'Expected property name after "."',
                ).lexeme;
                expression = {
                    type: 'Property',
                    table: expression,
                    property,
                };
            } else if (this.check('LEFT_PAREN') || this.check('COLON')) {
                expression = this.functionCallStatement(expression);
            }
        }

        return expression;
    }

    // Utility methods
    match(...tokenTypes) {
        for (let type of tokenTypes) {
            if (this.check(type)) {
                this.advance();

                return true;
            }
        }

        return false;
    }

    consume(tokenType, message) {
        if (this.check(tokenType)) return this.advance();

        throw new Error(`Line ${this.peek().line}: ${message}`);
    }

    check(tokenType) {
        if (this.isAtEnd()) return false;

        return this.peek().type === tokenType;
    }

    checkNext(tokenType) {
        if (this.isAtEnd()) return false;

        return this.tokens[this.current + 1].type === tokenType;
    }

    advance() {
        if (!this.isAtEnd()) this.current++;

        return this.previous();
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    isAtEnd() {
        return this.peek().type === 'EOF';
    }

    isAssignment() {
        if (this.check('IDENTIFIER')) {
            let tempCurrent = this.current + 1;

            while (tempCurrent < this.tokens.length) {
                if (this.tokens[tempCurrent].type === 'PERIOD') {
                    tempCurrent = tempCurrent + 2;
                } else if (this.tokens[tempCurrent].type === 'LEFT_BRACKET') {
                    tempCurrent++;

                    while (
                        this.tokens[tempCurrent].type !== 'RIGHT_BRACKET' &&
                        tempCurrent < this.tokens.length
                    ) {
                        tempCurrent++;
                    }

                    tempCurrent++;
                } else if (
                    this.tokens[tempCurrent].type === 'ASSIGN' ||
                    this.tokens[tempCurrent].type === 'COMMA'
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return false;
    }
}

export function printAST(node, indent = '') {
    if (Array.isArray(node)) {
        node.forEach((child) => printAST(child, indent + '    '));
        return;
    }

    const nodeType = node.type;
    console.log(`${indent}type: ${nodeType}`);

    for (const key in node) {
        if (key === 'type') continue;
        const child = node[key];

        if (Array.isArray(child)) {
            console.log(`${indent}${key}: [`);
            child.forEach((item) => {
                console.log(`${indent}    {`);
                printAST(item, indent + '        ');
                console.log(`${indent}    }`);
            });
            console.log(`${indent}]`);
        } else if (typeof child === 'object' && child !== null) {
            console.log(`${indent}${key}: {`);
            printAST(child, indent + '    ');
            console.log(`${indent}}`);
        } else {
            console.log(`${indent}${key}: ${JSON.stringify(child)}`);
        }
    }
}

export default Parser;
