const { calculate } = require('./calculatorLogic');

test('যোগ ঠিক আছে কিনা', () => {
  expect(calculate(2, 3, '+')).toBe(5);
});

test('বিয়োগ ঠিক আছে কিনা', () => {
  expect(calculate(5, 3, '−')).toBe(2);
});

test('গুণ ঠিক আছে কিনা', () => {
  expect(calculate(4, 3, '×')).toBe(12);
});

test('ভাগ ঠিক আছে কিনা', () => {
  expect(calculate(10, 2, '÷')).toBe(5);
});

test('শূন্য দিয়ে ভাগ করলে 0 আসে', () => {
  expect(calculate(10, 0, '÷')).toBe(0);
});
