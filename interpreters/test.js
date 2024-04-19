const OPERATORS = ['+', '-', '*', '-'];

function Token(type, value, from, to) {
    this.type = type;
    this.value = value;
    this.from = from;
    this.to = to;
}

function tokenise(expression) {
    const listOfTokens = [];
    let position = 0;
    let type;
    let value;

    for (substring of expression.split(' ')) {
        if (OPERATORS.find((item) => item === substring)) {
            type = 'operator';
            value = substring;
        } else if (!isNaN(substring)) {
            type = 'number';
            value = parseFloat(substring);
        }

        const token = new Token(
            type,
            value,
            position,
            position + substring.length
        );
        listOfTokens.push(token);
        position = position + substring.length + 1;
    }

    return listOfTokens;
}

const expression = '1 + 2 * 4';
console.log(tokenise(expression));
