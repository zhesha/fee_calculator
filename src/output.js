const makeRounding = require("../utils/makeRounding");

function showFees(feesList) {
  feesList.forEach((element) => {
    const amount = makeRounding(element);
    console.log(amount.toFixed(2));
  });
}

module.exports = showFees;
