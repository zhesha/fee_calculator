const calculateFeeForTransaction = require("./transaction");

function calculateFees(input) {
  if (!Array.isArray(input)) {
    throw new Error("Input data must be an array with transactions");
  }
  const userTotalPerWeek = {};
  return input.map((transaction) =>
    calculateFeeForTransaction(transaction, userTotalPerWeek)
  );
}

module.exports = calculateFees;
