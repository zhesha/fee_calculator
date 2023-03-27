// Keeps track of the total amount of money spent by each user per week
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
