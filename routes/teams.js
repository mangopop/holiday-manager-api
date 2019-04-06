var express = require("express");
var router = express.Router();

var Models = require("../sequelize");
var Team = Models.Team;

// GET    team          /teams/:teamId
// GET    all teams     /teams
// DELETE team          /teams/:teamId
// UPDATE team          /teams/:teamId
// POST   team          /teams

// POST   team manager  /teams/:teamId/user/:userId
// UPDATE team mangager /teams/:teamId/user/:userId
// DELETE team mangager /teams/:teamId/user/:userId

// TODO: error handling

// Find all teams
router.get("/", function(req, res, next) {
  Team.findAll().then(teams => {
    console.log("All teams:", JSON.stringify(teams, null, 4));
    res.json(teams);
  });
});

// get team by id
router.get("/:teamId", function(req, res, next) {
  Team.findOne({
    where: {
      id: req.params.teamId
    }
  })
    .then(team => {
      res.json(team);
    })
    .catch(err =>
      res.status(400).json({
        err: `team with id = [${req.params.teamId}] doesn\'t exist.${err}`
      })
    );
});

// Create a new team
router.post("/", function(req, res, next) {
  console.log(req.body.name);
  Team.create({
    name: req.body.name
  }).then(team => {
    console.log("team's auto-generated ID:", team.id);
    res.json(team.id);
  });
});

// update a new team
router.put("/", function(req, res, next) {
  // console.log(req.body.name);
  // Team.create({
  //   name: req.body.name
  // }).then(team => {
  //   console.log("team's auto-generated ID:", team.id);
  //   res.json(team.id);
  // });
});

// update team by id
router.put("/:teamId", function(req, res, next) {
  Team.update(
    {
      name: req.body.name
    },
    {
      where: {
        id: req.params.teamId
      }
    }
  )
    .then(team => {
      res.json(team);
    })
    .catch(err =>
      res.status(400).json({
        err: `team with id = [${req.params.teamId}] doesn\'t exist.${err}`
      })
    );
});

// delete a team
router.delete("/:teamId", function(req, res, next) {
  Team.destroy({
    where: {
      name: req.body.id
    }
  }).then(() => {
    console.log("Done");
  });
});

module.exports = router;
