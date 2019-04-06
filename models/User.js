module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    email: { type: type.STRING, allowNull: false, unique: true },
    hash: type.STRING,
    totalHoliday: type.INTEGER
  });
};

// TODO: validate
