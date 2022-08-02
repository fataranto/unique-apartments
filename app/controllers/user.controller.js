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

  //buscar todos los apatarmentos del usuario, traer el id del apartamentp, el título, la ciudad y el estado  
  const apartments = await Apartment.find({
    owner: req.userId
  },"_id title location.city location.state");
   
//si hay un apartamento, mostrar el apartamento, si no, mostrar un mensaje de que no hay apartamentos
  if(apartments.length > 0) {
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
  }


  //console.log(apartments)

 

  //${req.params.user}  ${req.userId} -> de aquí puedo coger la ruta de usuario y el id
};