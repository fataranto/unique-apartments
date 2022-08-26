const db = require("../models");
const {authJwt} = require("../middlewares");
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

    let apartments = [];
    let totalApartments, totalApartmentsBarcelona, totalApartmentsGirona, totalApartmentsLleida, totalApartmentsTarragona;

    //if user is admin find all apartments and count them by province
    if (req.isAdmin) {
      apartments = await Apartment.find({},
        "_id title location.city location.state");

      totalApartments = apartments.length;

      totalApartmentsBarcelona = apartments.filter(apartment => apartment.location.state === "Barcelona").length;
      totalApartmentsGirona = apartments.filter(apartment => apartment.location.state === "Girona").length;
      totalApartmentsLleida = apartments.filter(apartment => apartment.location.state === "Lleida").length;
      totalApartmentsTarragona = apartments.filter(apartment => apartment.location.state === "Tarragona").length;

    } 
    //if user is host find all his apartments
    if (req.isHost) {
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
        isAdmin: req.isAdmin,
        isHost: req.isHost
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

  var user, userProfile;


  try {
    //if logged user is admin he can get any user profile
    if (req.isAdmin) {
      userProfile = await User.findById(req.params.user).populate("roles", "-__v");
    } else {
      //if logged user is not admin he can only get his own profile
      userProfile = await User.findById(req.userId).populate("roles", "-__v");
    }
    //if user is admin and he is getting other user profile I would need to pass the logged user to the view as well
    user = await User.findById(req.userId).populate("roles", "-__v");

    //get user profile roles
    const userProfileAdmin = userProfile.roles.find(role => role.name === "admin");
    //console.log(userProfileAdmin);
    const userProfileIsAdmin = userProfileAdmin ? true : false;

    const userProfileHost = userProfile.roles.find(role => role.name === "host");
    const userProfileIsHost = userProfileHost ? true : false;


    //if user is admin or host find all or his apartments
    let apartments = [];

    if (req.isAdmin) {
      apartments = await Apartment.find({},
        "_id title location.city location.state");

    } 
    if (req.isHost) {
      apartments = await Apartment.find({
        owner: req.userId
      }, "_id title location.city location.state");
    }


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

  //console.log(req.params.user);
  try {
    const fullUser = await User.findById(req.params.user).populate("roles", "-__v");
    //console.log(user)

    //if user is admin find all apartments
    let apartments = [];

    if (req.isAdmin) {
      apartments = await Apartment.find({},
        "_id title location.city location.state");
      }

    if (req.isHost) {
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
  const fullUser = await User.findById(req.userId).populate("roles", "-__v");
  //console.log(fullUser)

  const bookings = await Booking.find().populate("apartment", "_id title location.city location.state owner");
  //console.log(bookings);


  if (req.isHost) {
    hostBookings = bookings.filter(booking => booking.apartment.owner == req.userId);
    //console.log("hostBookings", hostBookings);
  }

  guestBookings = bookings.filter(booking => booking.user == req.userId);
  //console.log("guestBookings", guestBookings);

  res.status(200).render('user-dashboard-bookings.ejs', {
    user: {
      id: req.userId,
      username: fullUser.username,
      isAdmin: req.isAdmin,
      isHost: req.isHost
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
      isAdmin: req.isAdmin,
    },
    users,
    page: "users"
  })
}

exports.userDashboardMessages = async (req, res) => {

  //get all messages from user, both as sender and receiver
  try {
    const messages = await Message.find({
      $or: [{
        sender: req.userId
      }, {
        receiver: req.userId
      }]
    }).populate("sender", "_id username name lastname email").populate("receiver", "_id username name lastname email");
    //console.log("messages", messages);


    //filter messages and create an array of users in which both the sender and the receiver are not the current user and I only stay with the id and the username and the apartment
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
    //filter conversations to remove all duplicates
    const conversationsFilter = conversations.filter((conversation, index) => {
      return conversations.findIndex(conversation2 => conversation2.id == conversation.id) == index;
    }).map(conversation => {
      return {
        id: conversation.id,
        username: conversation.username,
        apartment: conversation.apartment
      }
    });

    const uniqueIds = new Set();
    const conversationsUnique = conversationsFilter.filter(e => {
      const duplicate = uniqueIds.has(e.username);
      uniqueIds.add(e.username);
      return !duplicate;
    });


    //get the name and last name of the current user
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