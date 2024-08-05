"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// The function 'sum' adds all numbers within a valid array of numbers
// Parameters: array (number[])
// Outputs: sum (number), throws error if invalid parameters

var sum = function sum(array) {
  if (!Array.isArray(array)) {
    throw new Error('An array of numbers must be provided.');
  } else if (!array.every(function (current) {
    return typeof current === 'number';
  })) {
    throw new Error('The array must only contain numbers.');
  }
  return array.reduce(function (acc, current) {
    return acc + current;
  }, 0);
};
var _default = exports["default"] = sum;