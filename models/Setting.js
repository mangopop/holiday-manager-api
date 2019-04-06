module.exports = (sequelize, type) => {
  return sequelize.define("setting", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    weekendBooking: type.BOOLEAN,
    maxHoliday: type.INTEGER
  });
};
/*
Max holiday
Bank holidays / custom dates (list of dates, json?)
Weeknd booking (yes, no)
*/
