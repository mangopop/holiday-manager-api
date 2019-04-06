module.exports = (sequelize, type) => {
  return sequelize.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    email: {
      type: type.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    hash: { type: type.STRING, allowNull: false },
    totalHoliday: {
      type: type.INTEGER,
      validate: { len: [0, 5], isNumeric: true }
    }
  });
};

// TODO: validate
