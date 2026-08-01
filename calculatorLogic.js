function calculate(a, b, operator) {
  switch (operator) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? 0 : a / b;
    default: return b;
  }
}

module.exports = { calculate };
