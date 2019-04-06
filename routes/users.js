var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../user/user.service");

var Models = require("../sequelize");
var User = Models.User;
var Team = Models.Team;
var Holiday = Models.Holiday;

// GET    user          /users/:userId
// GET    all users     /users
// GET    users teams   /users/:teamId
// GET    users holiday /users/:userId/holiday
// DELETE user          /users/:userId
// UPDATE user          /users/:userId
// POST   user          /users/register
// POST   user holiday  /users/:userId/holiday

// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //
//   ------------------------- USER  -------------------------- //
// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //

router.post("/authenticate", function(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
});

// get user by id
router.get("/:userId", function(req, res, next) {
  User.findOne({
    where: {
      id: req.params.userId
    }
  }).then(user => {
    res.json(user);
  });
});

// update user by id
router.put("/:userId", function(req, res, next) {
  User.update(
    {
      lastName: req.body.lastName
    },
    {
      where: {
        id: req.params.userId
      }
    }
  ).then(user => {
    res.json(user);
  });
});

// Find all users
router.get("/", function(req, res, next) {
  User.findAll().then(users => {
    res.json(users);
  });
});

// Create a new user
// TODO: findOrCreate
router.post("/register", function(req, res, next) {
  // check against email
  User.findAll({
    where: {
      email: req.body.email
    }
  }).then(users => {
    // create hash
    if (!users.length) {
      if (req.body.password) {
        User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          hash: bcrypt.hashSync(req.body.password, 10)
        }).then(user => {
          res.json(user.id);
        });
      }
    }
  });
});

router.delete("/", function(req, res, next) {
  User.destroy({
    where: {
      firstName: req.body.firstName
    }
  }).then(() => {
    console.log("Done");
  });
});

// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //
//   --------------------- USER - TEAM ------------------------ //
// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //

// get user by id with team
router.get("/:userId/team", function(req, res, next) {
  User.findOne({
    where: {
      id: req.params.userId
    },
    include: [{ model: Team }]
  }).then(response => {
    // user.getTeams().then(response => {
    res.json(response);
    // });
  });
});

// Find all users by team id
router.get("/team/:teamId", function(req, res, next) {
  User.findAll({
    include: [{ model: Team, where: { name: req.params.teamId } }]
  }).then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
    res.json(users);
  });
});

// add a new team to user
router.post("/:userId/team/:teamId", function(req, res, next) {
  Promise.all([
    User.findOne({
      where: {
        id: req.params.userId
      }
    }),
    Team.findOne({
      where: {
        id: req.params.teamId
      }
    })
  ]).then(([user, team]) => {
    // team
    //   .hasUser(user)
    //   .then(response => console.log(response))
    //   .catch(err => res.status(400).json({ err: `what? ${err}` }));
    user.addTeam(team).then(result => {
      res.json(result);
    });
  });
});

// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //
//   ------------------- USER - HOLIDAY ----------------------- //
// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //

// get user by id with holiday
router.get("/:userId/holiday", function(req, res, next) {
  User.findOne({
    where: {
      id: req.params.userId
    },
    include: [{ model: Holiday }]
  }).then(user => {
    res.json(user);
  });
});

// create holiday on user
router.post("/:userId/holiday", function(req, res, next) {
  Promise.all([
    User.findOne({
      where: {
        id: req.params.userId
      }
    }),
    Holiday.create({ slot: req.body.slot, date: req.body.date })
  ]).then(([user, holiday]) => {
    // console.log(user);
    // console.log(holiday);
    user.addUserHoliday(holiday).then(result => {
      res.json(result);
    });
  });
});

module.exports = router;
