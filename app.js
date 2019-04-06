var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var teamsRouter = require("./routes/teams");
const bodyParser = require("body-parser");
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error_handler");
const guard = require("express-jwt-permissions")();
// const sequelize = require("./sequelize");
var app = express();

// app.use(guard.check("status"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// use JWT auth to secure the api
app.use(jwt());

// TODO: api routes
// app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/teams", teamsRouter);

module.exports = app;
