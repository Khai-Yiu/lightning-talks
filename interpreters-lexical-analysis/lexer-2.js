import { Token, tokenType, reservedKeywords } from './token.js';

function Lexer(sourceCode) {
    this.tokenList = [];
    this.sourceCode = sourceCode;
    this.startPosition = 0;
    this.currentPosition = 0;
    this.currentLine = 1;

    this.scanTokens = function () {
        while (!this.isEndOfFile()) {
            this.startPosition = this.currentPosition;
            this.tokenise();
        }

        this.addToken(tokenType.EOF);

        return this.tokenList;
    };

    this.tokenise = function () {
        const currentCharacter = this.advance();

        switch (currentCharacter) {
            case '(':
                this.addToken(tokenType.LEFT_PARENTHESIS);
                break;
            case ')':
                this.addToken(tokenType.RIGHT_PARENTHESIS);
                break;
            case '{':
                this.addToken(tokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(tokenType.RIGHT_BRACE);
                break;
            case '[':
                this.addToken(tokenType.LEFT_BRACKET);
                break;
            case ']':
                this.addToken(tokenType.RIGHT_BRACKET);
                break;
            case ',':
                this.addToken(tokenType.COMMA);
                break;
            case ';':
                this.addToken(tokenType.SEMICOLON);
                break;
            case '&':
                this.addToken(tokenType.AMPERSAND);
                break;
            case '|':
                this.addToken(tokenType.PIPE);
                break;
            case '#':
                this.addToken(tokenType.TAG);
                break;
            case '^':
                this.addToken(tokenType.CARET);
                break;
            case '+':
                this.addToken(tokenType.PLUS);
                break;
            case '*':
                this.addToken(tokenType.STAR);
                break;
            case '/':
                this.addToken(
                    this.matchNext('/')
                        ? tokenType.DOUBLE_SLASH
                        : tokenType.SLASH,
                );
                break;
            case ':':
                this.addToken(
                    this.matchNext(':')
                        ? tokenType.DOUBLE_COLON
                        : tokenType.COLON,
                );
                break;
            case '=':
                this.addToken(
                    this.matchNext('=') ? tokenType.EQUAL : tokenType.ASSIGN,
                );
                break;
            case '~':
                this.addToken(
                    this.matchNext('=') ? tokenType.NOT_EQUAL : tokenType.TILDE,
                );
                break;
            case '-':
                this.addToken(tokenType.MINUS);
                break;
            case '<':
                this.handleLessCase();
                break;
            case '>':
                this.handleGreaterCase();
                break;
            case '.':
                this.handleDotCase();
                break;
            case ' ':
                break;
            case '\r':
                break;
            case '\t':
                break;
            case '\t':
                break;
            case '\n':
                this.currentLine++;
                break;
            default:
                console.log(
                    `Invalid character at "${currentCharacter}" line ${this.currentLine}`,
                );
        }
    };

    this.advance = function () {
        this.currentPosition++;

        return this.sourceCode[this.currentPosition - 1];
    };

    this.addToken = function (tokenType, tokenValue = null) {
        const tokenLexeme = this.sourceCode.slice(
            this.startPosition,
            this.currentPosition,
        );
        const newToken = new Token(
            tokenType,
            tokenLexeme,
            tokenValue,
            this.currentLine,
        );

        this.tokenList.push(newToken);
    };

    this.isEndOfFile = function () {
        return this.currentPosition >= this.sourceCode.length;
    };

    this.matchNext = function (charactersToMatch) {
        const endSlicePosition =
            this.currentPosition + charactersToMatch.length;
        const nextCharacters = sourceCode.slice(
            this.currentPosition,
            endSlicePosition,
        );

        if (this.isEndOfFile() || nextCharacters !== charactersToMatch) {
            return false;
        }

        this.currentPosition = this.currentPosition + nextCharacters.length;
        return true;
    };

    // TOKEN FUNCTIONS

    this.handleLessCase = function () {
        if (this.matchNext('<')) {
            this.addToken(tokenType.LEFT_SHIFT);
        } else if (this.matchNext('=')) {
            this.addToken(tokenType.LESS_EQUAL);
        } else {
            this.addToken(tokenType.LESS);
        }
    };

    this.handleGreaterCase = function () {
        if (this.matchNext('>')) {
            this.addToken(tokenType.RIGHT_SHIFT);
        } else if (this.matchNext('=')) {
            this.addToken(tokenType.GREATER_EQUAL);
        } else {
            this.addToken(tokenType.GREATER);
        }
    };

    this.handleDotCase = function () {
        if (this.matchNext('..')) {
            this.addToken(tokenType.ELLIPSIS);
        } else if (this.matchNext('.')) {
            this.addToken(tokenType.CONCATENATE);
        } else {
            this.addToken(tokenType.PERIOD);
        }
    };
}

// HELPER METHODS

function isAlpha(character) {
    return (
        (character >= 'a' && character <= 'z') ||
        (character >= 'A' && character <= 'Z') ||
        character === '_'
    );
}

function isDigit(character) {
    return character >= '0' && character <= '9';
}

function isAlphaNumeric(character) {
    return isAlpha(character) || isDigit(character);
}

export default Lexer;
