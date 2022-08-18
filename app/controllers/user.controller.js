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

  const user = await User.findById(req.userId).populate("roles", "-__v");
  //console.log(user)

  //si el usuario tiene el rol admin busco todos los apartamentos
  let apartments = [];
  const admin = user.roles.find(role => role.name === "admin");

  //console.log(role);

  if (admin) {
    apartments = await Apartment.find({},
      "_id title location.city location.state");

  } else {
    apartments = await Apartment.find({
      owner: req.userId
    },"_id title location.city location.state");
  }

  
   

apartments.length > 0 ? res.status(200).render('user-dashboard.ejs', {
  user,
  apartments
}) : res.status(200).render('user-dashboard.ejs', {
  user,
  apartments: undefined
})
};


/*   if(apartments.length > 0) {
    res.status(200).render('user-dashboard.ejs', {
      user,
      apartments
    })
  }
  else {
    res.status(200).render('user-dashboard.ejs', {
      user,
      apartments: undefined
    })
  } */


  //console.log(apartments)

 

  //${req.params.user}  ${req.userId} -> de aquí puedo coger la ruta de usuario y el id
//};