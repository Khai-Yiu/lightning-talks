// The function 'sum' adds all numbers within a valid array of numbers
// Parameters: array (number[])
// Outputs: sum (number), throws error if invalid parameters

const sum = (array) => {
    if (!Array.isArray(array)) {
        throw new Error('An array of numbers must be provided.');
    } else if (!array.every((current) => typeof current === 'number')) {
        throw new Error('The array must only contain numbers.');
    }

    return array.reduce((acc, current) => acc + current, 0);
};

export default sum;
