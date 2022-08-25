const db = require("../models");
const {
  authJwt
} = require("../middlewares");
const User = db.user;
const Role = db.role;
const Apartment = db.apartment;
const Booking = db.booking;
const Message = db.message;


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
      totalBookings,
      page: "dashboard"
    })
  } catch (err) {
    res.status(500).render('error.ejs', {
      error: err
    })
  }
};

exports.userDashboardProfile = async (req, res) => {

  const loggedUserIsAdmin = req.isAdmin;
  var user;
  //console.log("loggedUserIsAdmin", loggedUserIsAdmin);


  //console.log(req.userId);
  try {
    if (loggedUserIsAdmin) {
      userProfile = await User.findById(req.params.user).populate("roles", "-__v");
    } else {
      userProfile = await User.findById(req.userId).populate("roles", "-__v");
    }
    user = await User.findById(req.userId).populate("roles", "-__v");

    const userProfileAdmin = userProfile.roles.find(role => role.name === "admin");
    const userProfileIsAdmin = userProfileAdmin ? true : false;

    const userProfileHost = userProfile.roles.find(role => role.name === "host");
    const userProfileIsHost = userProfileHost ? true : false;

    //const fullUser = await User.findById(req.userId).populate("roles", "-__v");
    //console.log(user)

    //si el usuario tiene el rol admin busco todos los apartamentos
    let apartments = [];

    if (loggedUserIsAdmin) {
      apartments = await Apartment.find({},
        "_id title location.city location.state");

    } else {
      apartments = await Apartment.find({
        owner: req.userId
      }, "_id title location.city location.state");
    }

    //apartments = apartments.length > 0 ? apartments : undefined;
    console.log(user);
    res.status(200).render('user-dashboard-profile.ejs', {
      userProfile,
      userProfileIsAdmin,
      userProfileIsHost,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        isAdmin: req.isAdmin,
        isHost: req.isHost
      },
      apartments,
      action: req.params.action ? req.params.action : "edit",
      page: "profile"
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
      apartments,
      page: "apartments"
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
  console.log(bookings);


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
    guestBookings,
    page: "bookings"
  })

};

exports.userDashboardUsers = async (req, res) => {

  fullUser = await User.findById(req.userId).populate("roles", "-__v");


  const users = await User.find({}, "_id username name lastname email roles").populate("roles", "-__v");

  res.status(200).render('user-dashboard-users.ejs', {
    user: {
      id: req.userId,
      username: fullUser.username,
      name: fullUser.name,
      lastname: fullUser.lastname,
      email: fullUser.email,
      isAdmin: isAdmin,
      isHost: isHost
    },
    users,
    page: "users"
  })
}

exports.userDashboardMessages = async (req, res) => {

  //busco todos los mensajes del usuario, tanto como sender como receiver

  try {
    const messages = await Message.find({
      $or: [{
        sender: req.userId
      }, {
        receiver: req.userId
      }]
    }).populate("sender", "_id username name lastname email").populate("receiver", "_id username name lastname email");
    //console.log("messages", messages);

    //filtro mensajes y creo un array de usuarios en los que tanto el sender como el receiver no son el usuario actual y me quedo solo con el id y el username y el apartment
    const conversations = messages.filter(message => message.sender._id != req.userId).map(message => {
      return {
        id: message.sender._id,
        username: message.sender.name + " " + message.sender.lastname,
        apartment: message.apartment
      }
    }).concat(messages.filter(message => message.receiver._id != req.userId).map(message => {
      return {
        id: message.receiver._id,
        username: message.receiver.name + " " + message.receiver.lastname,
        apartment: message.apartment
      }
    }));
    //filtro conversations para eliminar todos los ducplicados
    const conversationsFilter = conversations.filter((conversation, index) => {
      return conversations.findIndex(conversation2 => conversation2.id == conversation.id) == index;
    }).map(conversation => {
      return {
        id: conversation.id,
        username: conversation.username,
        apartment: conversation.apartment
      }
    });

    const conversationsUnique = [... new Set(conversationsFilter.map(data => data.id))];


    console.log("conversationsUnique", conversationsUnique);


    //console.log("conversations", conversations); //array de usuarios con los que tengo conversaciones

    //obtengo nombre y apellidos del usuario actual
    const fullUser = await User.findById(req.userId).populate("roles", "-__v");
    const fullName = fullUser.name + " " + fullUser.lastname;

    res.status(200).render('user-dashboard-messages.ejs', {
      user: {
        id: req.user.id,
        username: req.user.username,
        fullName: fullName,
        isAdmin: req.user.isAdmin,
        isHost: req.user.isHost,

      },
      conversations: conversationsUnique,
      page: "messages"
    })

  } catch (err) {
    res.status(500).render('error.ejs', {
      error: err
    })
  }
}