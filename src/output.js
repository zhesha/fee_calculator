function showFees(feesList) {
  feesList.forEach(element => {
    const amount = makeRounding(element);
    console.log(amount.toFixed(2));
  });
}

function makeRounding(amount) {
  return Math.ceil(amount * 100) / 100;
}

module.exports = showFees;
