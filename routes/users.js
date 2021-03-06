var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const userService = require("../user/user.service");
const guard = require("express-jwt-permissions")({
  permissionsProperty: "scope"
});

var Models = require("../sequelize");
var User = Models.User;
var Team = Models.Team;
var Holiday = Models.Holiday;
var Role = Models.Role;

// POST   user          /users/register
// POST   authenticate  /authenticate

// GET    user          /users/:userId
// GET    all users     /users
// GET    users teams   /users/:teamId
// DELETE user          /users/:userId
// UPDATE user          /users/:userId

// GET    users holiday /users/:userId/holiday
// POST   user holiday  /users/:userId/holiday

// GET    user role     /users/:userId/role/
// POST   user role     /users/:userId/role/:roleId

router.post("/authenticate", authenticate);
router.post("/register", register);

router.get("/:userId", guard.check("admin"), getById);
router.put("/:userId", guard.check("admin"), update);
router.get("/", guard.check("admin"), findAll);
router.delete("/delete", guard.check("admin"), _delete);

// router.get("/:userId/role", getRole);
router.post("/:userId/role/:roleId", guard.check("admin"), addRole);

// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //
//   ------------------------- USER  -------------------------- //
// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch(err => next(err));
}

// get user by id
function getById(req, res, next) {
  userService.getById(req.params.userId).then(user => {
    res.json(user);
  });
}

// update user by id
function update(req, res, next) {
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
}

// Find all users
function findAll(req, res, next) {
  User.findAll().then(users => {
    res.json(users);
  });
}

// Create a new user
// TODO: findOrCreate
function register(req, res, next) {
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
}

function _delete(req, res, next) {
  User.destroy({
    where: {
      firstName: req.body.firstName
    }
  }).then(() => {
    console.log("Done");
  });
}

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
    userService.getById(req.params.userId),
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
    userService.getById(req.params.userId),
    Holiday.create({ slot: req.body.slot, date: req.body.date })
  ]).then(([user, holiday]) => {
    // console.log(user);
    // console.log(holiday);
    user.addUserHoliday(holiday).then(result => {
      res.json(result);
    });
  });
});

// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //
//   ------------------- USER - role ----------------------- //
// <*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*><*> //

function addRole(req, res, next) {
  Promise.all([
    userService.getById(req.params.userId),
    Role.findOne({
      where: {
        id: req.params.roleId
      }
    })
  ]).then(([user, role]) => {
    user.addRole(role).then(() => res.json(user));
  });
}

module.exports = router;
