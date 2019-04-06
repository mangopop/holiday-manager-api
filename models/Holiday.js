module.exports = (sequelize, type) => {
  return sequelize.define("holiday", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: type.DATE,
    slot: type.ENUM("afternoon", "morning"),
    status: type.ENUM("pending", "booked", "rejected")
  });
};

/*
Date
Status (unbooked, pending, declined, booked)
Slot (full, morning, afternoon)
User (many - 1)
Team? (1 - many)
*/
