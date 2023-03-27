const getInput = require("./src/input.js");
const calculateFees = require("./src/fees.js");
const showFees = require("./src/output.js");

const input = getInput();
const feesList = calculateFees(input);
showFees(feesList);
