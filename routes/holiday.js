var express = require("express");
var router = express.Router();

var Models = require("../sequelize");
var Holiday = Models.Holiday;

// GET    holiday          /holidays/:holidayId
// GET    all holidays     /holidays
// DELETE holiday          /holidays/:holidayId
// UPDATE holiday          /holidays/:holidayId
// POST   holiday          /holidays

// Find all holiday
router.get("/", function(req, res, next) {
  Holiday.findAll().then(holiday => {
    console.log("All holiday:", JSON.stringify(holiday, null, 4));
    res.json(holiday);
  });
});

// get holiday by id
router.get("/:holidayId", function(req, res, next) {
  Holiday.findOne({
    where: {
      id: req.params.holidayId
    }
  })
    .then(holiday => {
      res.json(holiday);
    })
    .catch(err =>
      res.status(400).json({
        err: `holiday with id = [${req.params.holidayId}] doesn\'t exist.${err}`
      })
    );
});

// Create a new Holiday
router.post("/", function(req, res, next) {
  Holiday.create({
    slot: req.body.slot
  }).then(Holiday => {
    console.log("Holiday's auto-generated ID:", Holiday.id);
    res.json(Holiday.id);
  });
});

router.delete("/", function(req, res, next) {
  Holiday.destroy({
    where: {
      name: req.body.id
    }
  }).then(() => {
    console.log("Done");
  });
});

module.exports = router;
