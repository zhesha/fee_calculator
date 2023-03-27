function createUsersTotal () {
  const userTotalPerWeek = {};
  return {
    getTotal: (userId, week) => {
      if (!userTotalPerWeek[userId]) {
        userTotalPerWeek[userId] = {};
      }
      if (!userTotalPerWeek[userId][week]) {
        userTotalPerWeek[userId][week] = {
          amount: 0,
        };
      }
      return userTotalPerWeek[userId][week];
    }
  }
}

module.exports = createUsersTotal;