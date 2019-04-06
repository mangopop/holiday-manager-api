module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    email: type.STRING,
    totalHoliday: type.INTEGER
  });
};

// TODO: validate
