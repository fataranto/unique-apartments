const db = require("../models");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User content");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.hostBoard = (req, res) => {
  res.status(200).send("Host Content.");
};

exports.userDashboard = async (req, res) => {

  const user = await User.findById(req.userId).populate("roles", "-__v");
  //console.log(user)

  res.status(200).render('user-dashboard.ejs', {
    user
  })
  //${req.params.user}  ${req.userId} -> de aquí puedo coger la ruta de usuario y el id
};