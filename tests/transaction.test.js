const calculateFeeForTransaction = require("../src/transaction.js");
const createUsersTotal = require("../src/usersTotal.js");
const calculateFeeFromEpoch = require("../src/utils/calculateWeekFromEpoch.js");
const cashIn = require("./test_data/cash_in.json");
const juridicalCashOut = require("./test_data/juridical_cash_out.json");
const naturalCashOut = require("./test_data/natural_cash_out.json");

let usersTotal = createUsersTotal();
beforeEach(() => {
  usersTotal = createUsersTotal();
});

test("calculate for cash in", () => {
  expect(calculateFeeForTransaction(cashIn, usersTotal)).toBe(0.06);
});

test("calculate for cash in with limit exceeded", () => {
  const transaction = { ...cashIn };
  transaction.operation = {
    amount: 1000000,
    currency: "EUR",
  };
  expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(5);
});

test("calculate for juridical user cash out", () => {
  expect(calculateFeeForTransaction(juridicalCashOut, usersTotal)).toBe(0.9);
});

test("calculate for juridical user cash out, fall short limit", () => {
  const transaction = { ...juridicalCashOut };
  transaction.operation = {
    amount: 10,
    currency: "EUR",
  };
  expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(0.5);
});

describe("calculate for natural user cash out", () => {
  test("previous total is empty", () => {
    expect(calculateFeeForTransaction(naturalCashOut, usersTotal)).toBe(0);
  });

  test("previous total is not empty", () => {
    usersTotal.getTotal(
      1,
      calculateFeeFromEpoch(naturalCashOut.date)
    ).amount = 100;
    expect(calculateFeeForTransaction(naturalCashOut, usersTotal)).toBe(0);
  });

  test("previous total is more then limit", () => {
    usersTotal.getTotal(
      1,
      calculateFeeFromEpoch(naturalCashOut.date)
    ).amount = 1100;
    expect(calculateFeeForTransaction(naturalCashOut, usersTotal)).toBe(0.9);
  });

  test("previous total is empty, amount is more then limit", () => {
    const transaction = { ...naturalCashOut };
    transaction.operation = {
      amount: 1300,
      currency: "EUR",
    };
    expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(0.9);
  });

  test("previous total is less then limit, but sum is more then limit", () => {
    usersTotal.getTotal(
      1,
      calculateFeeFromEpoch(naturalCashOut.date)
    ).amount = 500;
    const transaction = { ...naturalCashOut };
    transaction.operation = {
      amount: 800,
      currency: "EUR",
    };
    expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(0.9);
  });

  test("handle few transactions", () => {
    const transaction = { ...naturalCashOut };
    transaction.operation = {
      amount: 800,
      currency: "EUR",
    };
    expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(0);
    expect(calculateFeeForTransaction(transaction, usersTotal)).toBe(1.8);
  });
});

describe("invalid transaction", () => {
  test("invalid date", () => {
    const transaction = { ...naturalCashOut };
    transaction.date = "invalid";
    expect(() => calculateFeeForTransaction(transaction)).toThrow(
      "Invalid date: invalid"
    );
  });

  test("invalid user id", () => {
    const transaction = { ...naturalCashOut };
    transaction.user_id = null;
    expect(() => calculateFeeForTransaction(transaction)).toThrow(
      'Invalid transaction: {"date":"2016-01-01","user_id":null,"user_type":"natural","type":"cash_out","operation":{"amount":300,"currency":"EUR"}}'
    );
  });

  test("invalid user type", () => {
    const transaction = { ...naturalCashOut };
    transaction.user_type = "invalid";
    expect(() => calculateFeeForTransaction(transaction)).toThrow(
      'Invalid transaction: {"date":"2016-01-01","user_id":1,"user_type":"invalid","type":"cash_out","operation":{"amount":300,"currency":"EUR"}}'
    );
  });

  test("invalid type", () => {
    const transaction = { ...naturalCashOut };
    transaction.type = "invalid";
    expect(() => calculateFeeForTransaction(transaction)).toThrow(
      'Invalid transaction: {"date":"2016-01-01","user_id":1,"user_type":"natural","type":"invalid","operation":{"amount":300,"currency":"EUR"}}'
    );
  });

  test("invalid operation", () => {
    const transaction = { ...naturalCashOut };
    transaction.operation = "invalid";
    expect(() => calculateFeeForTransaction(transaction)).toThrow(
      'Invalid transaction: {"date":"2016-01-01","user_id":1,"user_type":"natural","type":"cash_out","operation":"invalid"}'
    );
  });
});
