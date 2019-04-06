module.exports = (sequelize, type) => {
  return sequelize.define("team", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    manager: type.INTEGER
  });
};
