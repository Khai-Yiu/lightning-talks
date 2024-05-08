import util from 'util';

export const tokenType = {
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    STAR: 'STAR',
    SLASH: 'SLASH',
    PERCENT: 'PERCENT',
    CARET: 'CARET',
    TAG: 'TAG',
    EQUAL: 'EQUAL',
    NOT_EQUAL: 'NOT_EQUAL',
    LESS_EQUAL: 'LESS_EQUAL',
    GREATER_EQUAL: 'GREATER_EQUAL',
    LESS: 'LESS',
    GREATER: 'GREATER',
    ASSIGN: 'ASSIGN',
    LEFT_PARENTHESIS: 'LEFT_PAREN',
    RIGHT_PARENTHESIS: 'RIGHT_PAREN',
    LEFT_BRACE: 'LEFT_BRACE',
    RIGHT_BRACE: 'RIGHT_BRACE',
    LEFT_BRACKET: 'LEFT_BRACKET',
    RIGHT_BRACKET: 'RIGHT_BRACET',
    DOUBLE_COLON: 'DOUBLE_COLON',
    SEMICOLON: 'SEMICOLON',
    COMMA: 'COMMA',
    COLON: 'COLON',
    DOT: 'PERIOD',
    CONCATENATE: 'CONCATENATE',
    ELLIPSIS: 'ELLIPSIS',
    LEFT_SHIFT: 'LEFT_SHIFT',
    RIGHT_SHIFT: 'RIGHT_SHIFT',
    AMPERSAND: 'AMPERSAND',
    PIPE: 'PIPE',
    DOUBLE_SLASH: 'DOUBLE_SLASH',
    TILDE: 'TILDE',
    IDENTIFIER: 'IDENTIFIER',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    EOF: 'EOF',
};

export const reservedKeywords = {
    if: 'IF',
    else: 'ELSE',
    elseif: 'ELSEIF',
    then: 'THEN',
    and: 'AND',
    or: 'OR',
    not: 'NOT',
    end: 'END',
    function: 'FUNCTION',
    while: 'WHILE',
    do: 'DO',
    repeat: 'REPEAT',
    until: 'UNTIL',
    for: 'FOR',
    in: 'IN',
    return: 'RETURN',
    break: 'BREAK',
    goto: 'GOTO',
    continue: 'CONTINUE',
    local: 'LOCAL',
    true: 'TRUE',
    false: 'FALSE',
    nil: 'NIL',
};

export function Token(type, lexeme, value, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.value = value;
    this.line = line;
}

Token.prototype.toString = function () {
    return `Token { type: ${this.type}, lexeme: ${JSON.stringify(this.lexeme)}, value: ${JSON.stringify(this.value)}, line: ${this.line} }`
}