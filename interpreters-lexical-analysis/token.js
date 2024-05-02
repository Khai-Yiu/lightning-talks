import util from 'util';

export const tokenType = {
    PLUS: 'Plus',
    MINUS: 'Minus',
    STAR: 'Star',
    SLASH: 'Slash',
    PERCENT: 'Percent',
    CARET: 'Caret',
    TAG: 'Tag',
    EQUAL: 'Equal',
    NOT_EQUAL: 'NotEqual',
    LESS_EQUAL: 'LessEqual',
    GREATER_EQUAL: 'GreaterEqual',
    LESS: 'Less',
    GREATER: 'Greater',
    ASSIGN: 'Assign',
    LEFT_PARENTHESIS: 'LeftParenthesis',
    RIGHT_PARENTHESIS: 'RightParenthesis',
    LEFT_BRACE: 'LeftBrace',
    RIGHT_BRACE: 'RightBrace',
    LEFT_BRACKET: 'LeftBracket',
    RIGHT_BRACKET: 'RightBracket',
    DOUBLE_COLON: 'DoubleColon',
    SEMICOLON: 'Semicolon',
    COMMA: 'Comma',
    COLON: 'Colon',
    DOT: 'Period',
    CONCATENATE: 'Concatenate',
    ELLIPSIS: 'Ellipsis',
    LEFT_SHIFT: 'LeftShift',
    RIGHT_SHIFT: 'RightShift',
    AMPERSAND: 'Ampersand',
    PIPE: 'Pipe',
    DOUBLE_SLASH: 'DoubleSlash',
    TILDE: 'Tilde',
    IDENTIFIER: 'Identifier',
    STRING: 'StringLiteral',
    NUMBER: 'NumberLiteral',
    EOF: 'EOF',
};

export const reservedKeywords = {
    if: 'If',
    else: 'Else',
    elseif: 'ElseIf',
    then: 'Then',
    and: 'And',
    or: 'Or',
    not: 'Not',
    end: 'End',
    function: 'Function',
    while: 'While',
    do: 'Do',
    repeat: 'Repeat',
    until: 'Until',
    for: 'For',
    in: 'In',
    return: 'Return',
    break: 'Break',
    goto: 'Goto',
    continue: 'Continue',
    local: 'Local',
    true: 'True',
    false: 'False',
    nil: 'Nil',
};

export function Token(type, lexeme, value, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.value = value;
    this.line = line;
}

Token.prototype.toString = function () {
    const formattedToken = `Token { type: ${this.type}, lexeme: '${this.lexeme}', value: ${this.value}, line: ${this.line} }`;
    return util.inspect(formattedToken);
};
