var express = require("express");
var router = express.Router();
const guard = require("express-jwt-permissions")({
  permissionsProperty: "scope"
});

var Models = require("../sequelize");
var Role = Models.Role;

// GET    Role          /Roles/:RoleId
// GET    all Roles     /Roles
// DELETE Role          /Roles/:RoleId
// UPDATE Role          /Roles/:RoleId
// POST   Role          /Roles

// Find all Roles
router.get("/", function(req, res, next) {
  Role.findAll().then(Roles => {
    console.log("All Roles:", JSON.stringify(Roles, null, 4));
    res.json(Roles);
  });
});

// get Role by id
router.get("/:roleId", function(req, res, next) {
  Role.findOne({
    where: {
      id: req.params.RoleId
    }
  }).then(Role => {
    res.json(Role);
  });
});

// Create a new Role
router.post("/", guard.check("admin"), function(req, res, next) {
  console.log(req.body.name);
  Role.create({
    name: req.body.name
  }).then(Role => {
    console.log("Role's auto-generated ID:", Role.id);
    res.json(Role.id);
  });
});

// update a new Role
router.put("/", guard.check("admin"), function(req, res, next) {
  // console.log(req.body.name);
  // Role.create({
  //   name: req.body.name
  // }).then(Role => {
  //   console.log("Role's auto-generated ID:", Role.id);
  //   res.json(Role.id);
  // });
});

// delete a Role
router.delete("/:RoleId", guard.check("admin"), function(req, res, next) {
  Role.destroy({
    where: {
      name: req.body.id
    }
  }).then(() => {
    console.log("Done");
  });
});

module.exports = router;
