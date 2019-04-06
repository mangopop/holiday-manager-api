const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const db = require("_helpers/db");
// const User = db.User;

var Models = require("../sequelize");
var User = Models.User;

module.exports = {
  authenticate,
  getById
  //   getAll,
  //   create,
  //   update,
  //   delete: _delete
};

async function authenticate({ email, password }) {
  const user = await User.findOne({
    where: {
      email: email
    }
  });
  if (user && bcrypt.compareSync(password, user.hash)) {
    delete user.dataValues.hash;
    const roles = await user.getRoles();
    var scope = "";
    if (roles.length) {
      roles.forEach(element => {
        scope = scope + element.name + " ";
      });
    }
    scope = scope.trim();
    const token = jwt.sign({ sub: user.id, scope: scope }, config.secret);
    return {
      user,
      token
    };
  }
}

// async function getAll() {
//   return await User.find().select("-hash");
// }

async function getById(id) {
  return await User.findOne({
    where: {
      id: id
    }
  });
}

// async function create(userParam) {
//   // validate
//   if (await User.findOne({ username: userParam.username })) {
//     throw 'Username "' + userParam.username + '" is already taken';
//   }

//   const user = new User(userParam);

//   // hash password
//   if (userParam.password) {
//     user.hash = bcrypt.hashSync(userParam.password, 10);
//   }

//   // save user
//   await user.save();
// }

// async function update(id, userParam) {
//   const user = await User.findById(id);

//   // validate
//   if (!user) throw "User not found";
//   if (
//     user.username !== userParam.username &&
//     (await User.findOne({ username: userParam.username }))
//   ) {
//     throw 'Username "' + userParam.username + '" is already taken';
//   }

//   // hash password if it was entered
//   if (userParam.password) {
//     userParam.hash = bcrypt.hashSync(userParam.password, 10);
//   }

//   // copy userParam properties to user
//   Object.assign(user, userParam);

//   await user.save();
// }

// async function _delete(id) {
//   await User.findByIdAndRemove(id);
// }
