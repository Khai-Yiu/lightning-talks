import srcSum from 'sum';
import distSum from '../dist/sum';

describe('sum', () => {
    describe('given an array', () => {
        describe('and it is empty', () => {
            it('returns 0', () => {
                const array = [];

                expect(srcSum(array)).toBe(0);
                expect(distSum(array)).toBe(0);
            });
        });
        describe('and it contains only numbers', () => {
            it('returns the sum', () => {
                const array = [1, 2, 3, 4];

                expect(srcSum(array)).toBe(10);
                expect(distSum(array)).toBe(10);
            });
        });
        describe('and it contains values other than numbers', () => {
            it('throws an error', () => {
                const array = [1, true, 'Hello, World!'];

                expect(() => srcSum(array)).toThrow(
                    'The array must only contain numbers.',
                );
                expect(() => distSum(array)).toThrow(
                    'The array must only contain numbers.',
                );
            });
        });
    });
    describe('given no array is provided to the function', () => {
        it('throws an error', () => {
            expect(() => srcSum()).toThrow(
                'An array of numbers must be provided.',
            );
            expect(() => distSum()).toThrow(
                'An array of numbers must be provided.',
            );
        });
    });
});
