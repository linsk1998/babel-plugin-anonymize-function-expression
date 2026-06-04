console.log(calc);
const factorial = function () {
  function calc(n) {
    return n <= 1 ? 1 : n * calc(n - 1);
  }
  return calc;
}();
