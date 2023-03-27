function createUsersTotal() {
  const userTotalPerWeek = {};
  return {
    getTotal: (userId, week) => {
      if (!userTotalPerWeek[userId]) {
        userTotalPerWeek[userId] = {};
      }
      if (!userTotalPerWeek[userId][week]) {
        userTotalPerWeek[userId][week] = {
          amount: 0,
          add: function (amount) {
            this.amount += amount;
          },
        };
      }
      return userTotalPerWeek[userId][week];
    },
  };
}

module.exports = createUsersTotal;
