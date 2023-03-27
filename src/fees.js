function calculateFees(input) {
  if (!Array.isArray(input)) {
    throw new Error("Input data must be an array with transactions");
  }
  const feesList = input.map((transaction) => calculateFeeForTransaction(transaction));
  return feesList;
}

function calculateFeeForTransaction(transaction) {
  const { date, user_id: userId, user_type: userType, type, operation } = transaction;
  if (!isValidTransaction(transaction)) {
    throw new Error(`Invalid transaction: ${JSON.stringify(transaction)}`);
  }
  if (type === "cash_in") {
    return calculateCashInFee(operation.amount);
  }
  if (type === "cash_out") {
    if (userType === "natural") {
      return calculateNaturalCashOutFee(date, userId, operation.amount);
    }
    if (userType === "juridical") {
      return calculateJuridicalCashOutFee(operation.amount);
    }
  }
};

function isValidTransaction(transaction) {
  const { date, user_id: userId, user_type: userType, type, operation } = transaction;
  if (typeof date !== "string" || typeof userId !== "number" || typeof userType !== "string" || typeof type !== "string" || !operation) {
    return false;
  }
  if (userType !== "natural" && userType !== "juridical") {
    return false;
  }
  if (type !== "cash_in" && type !== "cash_out") {
    return false;
  }
  if (!operation.amount || operation.amount < 0) {
    return false;
  }
  return true;
}

function calculateCashInFee(amount) {
  const fee = amount * 0.0003;
  return fee > 5 ? 5 : fee;
}

function calculateNaturalCashOutFee(date, userId, amount) {
  const fee = amount * 0.003;
  return fee;
}

function calculateJuridicalCashOutFee(amount) {
  const fee = amount * 0.003;
  return fee < 0.5 ? 0.5 : fee;
}

module.exports = calculateFees;
