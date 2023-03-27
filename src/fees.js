const calculateFeeForTransaction = require("./transaction");
const createUsersTotal = require("./usersTotal");

function calculateFees(input) {
  if (!Array.isArray(input)) {
    throw new Error("Input data must be an array with transactions");
  }
  const usersTotal = createUsersTotal();
  return input.map((transaction) =>
    calculateFeeForTransaction(transaction, usersTotal)
  );
}

module.exports = calculateFees;
