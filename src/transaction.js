const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear");
const en = require("dayjs/locale/en");
const config = require("./config");

dayjs.locale({
  ...en,
  weekStart: 1,
});
dayjs.extend(weekOfYear);

function isValidTransaction(transaction) {
  const {
    date,
    user_id: userId,
    user_type: userType,
    type,
    operation,
  } = transaction;
  if (
    typeof date !== "string" ||
    typeof userId !== "number" ||
    typeof userType !== "string" ||
    typeof type !== "string" ||
    !operation
  ) {
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
  const fee = (amount * config.cashIn.percents) / 100;
  const max = config.cashIn.max.amount;
  return fee > max ? max : fee;
}

function calculateNaturalCashOutFee(amount, total) {
  let freeAmount = config.cashOutNatural.week_limit.amount - total.amount;
  if (freeAmount <= 0) {
    freeAmount = 0;
  }
  total.add(amount);
  if (freeAmount > amount) {
    return 0;
  }
  return ((amount - freeAmount) * config.cashOutNatural.percents) / 100;
}

function calculateJuridicalCashOutFee(amount) {
  const fee = (amount * config.cashOutJuridical.percents) / 100;
  const min = config.cashOutJuridical.min.amount;
  return fee < min ? min : fee;
}

function calculateFeeForTransaction(transaction, usersTotal) {
  const {
    date,
    user_id: userId,
    user_type: userType,
    type,
    operation,
  } = transaction;
  if (!isValidTransaction(transaction)) {
    throw new Error(`Invalid transaction: ${JSON.stringify(transaction)}`);
  }
  const day = dayjs(date);
  if (!day.isValid()) {
    throw new Error(`Invalid date: ${date}`);
  }
  if (type === "cash_in") {
    return calculateCashInFee(operation.amount);
  }
  if (userType === "juridical") {
    return calculateJuridicalCashOutFee(operation.amount);
  }
  const total = usersTotal.getTotal(userId, day.week());
  return calculateNaturalCashOutFee(operation.amount, total);
}

module.exports = calculateFeeForTransaction;
