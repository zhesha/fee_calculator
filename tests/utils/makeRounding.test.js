const makeRounding = require("../../src/utils/makeRounding.js");

test("rounding", () => {
  expect(makeRounding(0.005)).toBe(0.01);
});
