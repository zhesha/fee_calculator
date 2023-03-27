const calculateFees = require("../src/fees.js");
const cashIn = require("./test_data/cash_in.json");
const juridicalCashOut = require("./test_data/juridical_cash_out.json");
const naturalCashOut = require("./test_data/natural_cash_out.json");

test("calculate for cash in", () => {
  const input = [cashIn, juridicalCashOut, naturalCashOut];
  expect(calculateFees(input)).toEqual([0.06, 0.9, 0]);
});

test("Error", () => {
  const input = cashIn;
  expect(() => calculateFees(input)).toThrow(
    "Input data must be an array with transactions"
  );
});
