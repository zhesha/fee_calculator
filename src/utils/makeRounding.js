function makeRounding(amount) {
  return Math.ceil(amount * 100) / 100;
}

module.exports = makeRounding;
