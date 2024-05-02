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
                this.addToken(tokenType.SLASH);
                break;
            case ':':
                this.addToken(tokenType.COLON);
                break;
            case '=':
                this.addToken(tokenType.EQUAL);
                break;
            case '~':
                this.addToken(tokenType.TILDE);
                break;
            case '-':
                this.addToken(tokenType.MINUS);
                break;
            case '<':
                this.addToken(tokenType.LESS);
                break;
            case '>':
                this.addToken(tokenType.GREATER);
                break;
            case '.':
                this.addToken(tokenType.PERIOD);
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
                    `Invalid character at "${currentCharacter}" line ${this.currentLine}`
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
            this.currentPosition
        );
        const newToken = new Token(
            tokenType,
            tokenLexeme,
            tokenValue,
            this.currentLine
        );

        this.tokenList.push(newToken);
    };

    this.isEndOfFile = function () {
        return this.currentPosition >= this.sourceCode.length;
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
