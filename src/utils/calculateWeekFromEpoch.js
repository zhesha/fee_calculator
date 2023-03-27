const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
const firstSunday = dayjs.utc("1970-01-04").unix();
// This functions calculates the number of weeks from start of a Unix epoch
// For example 1970-01-04 is the first week, and 1970-01-05 is the second week, as 01/05 - is a monday
function calculateWeekFromEpoch(date) {
  const day = dayjs(date);
  if (!day.isValid()) {
    return null;
  }
  return Math.ceil((day.unix() - firstSunday) / (7 * 24 * 60 * 60));
}

module.exports = calculateWeekFromEpoch;
