const db = require("../models");
const User = db.user;
const Role = db.role;
const Apartment = db.apartment;
const Booking = db.booking;

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

  //console.log(req.params.user);
  try {
    const fullUser = await User.findById(req.params.user).populate("roles", "-__v");
    //console.log(user)

    //si el usuario tiene el rol admin busco todos los apartamentos
    let apartments = [];
    let totalApartments, totalApartmentsBarcelona, totalApartmentsGirona, totalApartmentsLleida, totalApartmentsTarragona;
    const admin = fullUser.roles.find(role => role.name === "admin");
    const isAdmin = admin ? true : false;

    const host = fullUser.roles.find(role => role.name === "host");
    const isHost = host ? true : false;

    //console.log(role);

    if (admin) {
      apartments = await Apartment.find({},
        "_id title location.city location.state");

      totalApartments = apartments.length;

      totalApartmentsBarcelona = apartments.filter(apartment => apartment.location.state === "Barcelona").length;
      totalApartmentsGirona = apartments.filter(apartment => apartment.location.state === "Girona").length;
      totalApartmentsLleida = apartments.filter(apartment => apartment.location.state === "Lleida").length;
      totalApartmentsTarragona = apartments.filter(apartment => apartment.location.state === "Tarragona").length;


    } else {
      apartments = await Apartment.find({
        owner: req.userId
      }, "_id title location.city location.state");
    }

    apartments = apartments.length > 0 ? apartments : undefined;

    const totalBookings = await Booking.countDocuments();





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
      apartments,
      totalApartments,
      totalApartmentsBarcelona,
      totalApartmentsGirona,
      totalApartmentsLleida,
      totalApartmentsTarragona,
      totalBookings
    })
  } catch (err) {
    res.status(500).render('error.ejs', {
      error: err
    })
  }
};

exports.userDashboardProfile = async (req, res) => {

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
      }, "_id title location.city location.state");
    }

    apartments = apartments.length > 0 ? apartments : undefined;

    res.status(200).render('user-dashboard-profile.ejs', {
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

exports.userDashboardApartments = async (req, res) => {

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
      }, "_id title location.city location.state");
    }

    apartments = apartments.length > 0 ? apartments : undefined;

    res.status(200).render('user-dashboard-apartments.ejs', {
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

exports.userDashboardBookings = async (req, res) => {

  //console.log(req.params.user);
  var hostBookings = [];
  var guestBookings = []; 
  const fullUser = await User.findById(req.params.user).populate("roles", "-__v");
  //console.log(fullUser)

  const admin = fullUser.roles.find(role => role.name === "admin");
  const isAdmin = admin ? true : false;

  const host = fullUser.roles.find(role => role.name === "host");
  const isHost = host ? true : false;

  const bookings = await Booking.find().populate("apartment", "_id title location.city location.state owner");


  if (host) {
    hostBookings = bookings.filter(booking => booking.apartment.owner == req.params.user);
    console.log("hostBookings", hostBookings);
  }

  guestBookings = bookings.filter(booking => booking.user == req.params.user);
  console.log("guestBookings", guestBookings);

  res.status(200).render('user-dashboard-bookings.ejs', {
    user: {
      id: req.userId,
      username: fullUser.username,
      name: fullUser.name,
      lastname: fullUser.lastname,
      email: fullUser.email,
      isAdmin: isAdmin,
      isHost: isHost
    },
    apartments: undefined,
    bookings,
    hostBookings,
    guestBookings
  })

};