const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const UserModel = require("./models/User");
const TeamModel = require("./models/Team");
const HolidayModel = require("./models/Holiday");
const SettingModel = require("./models/Setting");
// Option 1: Passing parameters separately
const sequelize = new Sequelize("sequelize", "root", "supersecurepassword", {
  host: "localhost",
  dialect: "mysql"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
// Option 2: Using a connection URI
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

const User = UserModel(sequelize, Sequelize);
const Holiday = HolidayModel(sequelize, Sequelize);
const Team = TeamModel(sequelize, Sequelize);
const Setting = SettingModel(sequelize, Sequelize);

//Instances of User will get the accessors getUserHolidays and setUserHolidays
User.hasMany(Holiday, { as: "UserHolidays" });
// getUsers, setUsers, addUser, addUsers to Team,
// getTeams, setTeams, addTeam, addTeams to User
Team.belongsToMany(User, { through: "UserTeam" });
User.belongsToMany(Team, { through: "UserTeam" });
// User.belongsTo(Team);

// TODO: create a new new user - normal create will not add hash?
const seed = () => {
  return Promise.all([
    User.create({
      firstName: "Elliott",
      lastName: "Norton",
      email: "elliott@gmail.com",
      hash: bcrypt.hashSync("elliott@gmail.com", 10)
    }),
    User.create({
      firstName: "Finlay",
      lastName: "Norton",
      email: "finlay@gmail.com",
      hash: bcrypt.hashSync("finlay@gmail.com", 10)
    }),
    Team.create({ name: "Team1" }),
    Team.create({ name: "Team2" }),
    Holiday.create({ slot: "Morning", Date: Date.now })
  ])
    .then(([elliott, finlay, team1, team2, holiday]) => {
      return Promise.all([
        elliott.setTeams([team1]),
        finlay.setTeams([team1, team2])
        // team2.setUsers(elliott)
      ]);
    })
    .catch(error => console.log(error));
};

// //{ force: true }
// Holiday.drop();
// // UserTeam.drop();
// User.drop();
// Team.drop();

sequelize.sync({ force: true }).then(() => seed());

module.exports = {
  User,
  Holiday,
  Team,
  Setting
};
