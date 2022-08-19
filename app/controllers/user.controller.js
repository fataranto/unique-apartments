const db = require("../models");
const User = db.user;
const Role = db.role;
const Apartment = db.apartment;

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

  console.log(req.params.user);
  try {
      const fullUser = await User.findById(req.params.user).populate("roles", "-__v");
      //console.log(user)

      //si el usuario tiene el rol admin busco todos los apartamentos
      let apartments = [];
      const admin = fullUser.roles.find(role => role.name === "admin");
      const isAdmin = admin ? true : false;

      const host = fullUser.roles.find(role => role.name === "host");
      const isHost = host ? true : false;

      //console.log(role);

      if (admin) {
        apartments = await Apartment.find({},
          "_id title location.city location.state");

      } else {
        apartments = await Apartment.find({
          owner: req.userId
        },"_id title location.city location.state");
      }

      apartments = apartments.length >0 ? apartments : undefined;

      res.status(200).render('user-dashboard.ejs', {
        user: {
          id: req.userId,
          username: fullUser.username,
          name: fullUser.name,
          lastname: fullUser.lastname,
          email: fullUser.email,
          isAdmin: isAdmin,
          isHost: isHost
        },
        apartments
      })
  } catch (err) {
    res.status(500).render('error.ejs', {
      error: err 
  })
  }
};