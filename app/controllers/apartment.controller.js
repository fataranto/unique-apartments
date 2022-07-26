const db = require("../models");
const User = db.user;
const Apartment = db.apartment;
const Booking = db.booking;
const moment = require('moment');
const eMail = require("../middlewares/sendEmail");





exports.getAllApartments = async (req, res) => {
  let user = req.user ? req.user : false;

  const apartments = await Apartment.find().sort({
    price: 1
  });

  res.status(200).render('index.ejs', {
    user,
    apartments
  })
}

exports.getAddApartment = async (req, res) => {
  let user = req.user ? req.user : false;
  res.status(200).render('new-apartment.ejs', {
    user,
    apartment: {}
  })
};

exports.postAddApartment = async (req, res) => {
  const {
    title,
    description,
    price,
    availablefrom,
    availableto,
    capacity,
    rooms,
    bathrooms,
    meters,
    city,
    state,
    lat,
    long,
    rules,
    smoking,
    pets,
    wifi,
    tv,
    ac,
    heating,
    parking,
    adapted,
    hairdryer,
    shampoo,
    soap,
    hotwater,
    essentials,
    hangers,
    bedlinen,
    wardrobe,
    stove,
    fridge,
    microwave,
    tableware,
    coffeemaker,
    toaster,
    balcony,
    garden,
    pool,
    barbicue,
    digningarea,
    photourl1,
    photourl2,
    photourl3,
    photourl4,
    photourl5,
    photodescr1,
    photodescr2,
    photodescr3,
    photodescr4,
    photodescr5
  } = req.body;
  //console.log(req.body);

  const apartment = new Apartment({
    title,
    description,
    price,
    availablefrom,
    availableto,
    capacity,
    rooms,
    bathrooms,
    meters,
    location: {
      city,
      state,
      lat,
      long
    },
    rules: {
      rules,
      smoking,
      pets
    },
    amenities: {
      general: {
        wifi,
        tv,
        ac,
        heating,
        parking,
        adapted
      },
      bathroom: {
        hairdryer,
        shampoo,
        soap,
        hotwater
      },
      bedroom: {
        essentials,
        hangers,
        bedlinen,
        wardrobe
      },
      kitchen: {
        stove,
        fridge,
        microwave,
        tableware,
        coffeemaker,
        toaster,
      },
      outdoor: {
        balcony,
        garden,
        pool,
        barbicue,
        digningarea,
      },
    },
    photo1: {
      url: photourl1,
      description: photodescr1
    },
    photo2: {
      url: photourl2,
      description: photodescr2
    },
    photo3: {
      url: photourl3,
      description: photodescr3
    },
    photo4: {
      url: photourl4,
      description: photodescr4
    },
    photo5: {
      url: photourl5,
      description: photodescr5
    },
    owner: req.userId
  });

  //console.log("apartment: ", apartment)

  await apartment.save();
  res.redirect("/");

  //send an email to the user
  const user = await User.findById(req.userId);
  const emailMessage = `
      <h1>Your apartment has been created!</h1>
      <p>Hi ${user.name},</p>
      <p>Your apartment <strong>${apartment.title}</strong> is now online.</p>
      <p>Thanks,</p>`;
  eMail.sendEmail(user.name, user.email, "Your apartment has been created", emailMessage);

}

exports.getEditApartment = async (req, res) => {
  let user = req.user ? req.user : false;
  const userRoles = await User.findById(req.userId).populate("roles", "-__v");
  const admin = userRoles.roles.find(role => role.name === "admin");
  //console.log("admin: ", admin);

  const apartment = await Apartment.findById(req.params.apartment);
  //console.log(userRoles.roles);
  if (apartment.owner != req.userId && admin == undefined) {
    res.status(400).render('error.ejs', {
      error: "Error: Page not found or not authorized"
    })
  } else {
    //console.log(apartment);
    res.status(200).render('new-apartment.ejs', {
      user,
      apartment
    })
  }
}

exports.postUpdateApartment = async (req, res) => {
  const {
    title,
    description,
    price,
    availablefrom,
    availableto,
    capacity,
    rooms,
    bathrooms,
    meters,
    city,
    state,
    lat,
    long,
    rules,
    smoking,
    pets,
    wifi,
    tv,
    ac,
    heating,
    parking,
    adapted,
    hairdryer,
    shampoo,
    soap,
    hotwater,
    essentials,
    hangers,
    bedlinen,
    wardrobe,
    stove,
    fridge,
    microwave,
    tableware,
    coffeemaker,
    toaster,
    balcony,
    garden,
    pool,
    barbicue,
    digningarea,
    photourl1,
    photourl2,
    photourl3,
    photourl4,
    photourl5,
    photodescr1,
    photodescr2,
    photodescr3,
    photodescr4,
    photodescr5
  } = req.body;
  //console.log(req.body);

  const apartment = await Apartment.findById(req.params.apartment);
  apartment.title = title;
  apartment.description = description;
  apartment.price = price;
  apartment.availablefrom = availablefrom;
  apartment.availableto = availableto;
  apartment.capacity = capacity;
  apartment.rooms = rooms;
  apartment.bathrooms = bathrooms;
  apartment.meters = meters;
  apartment.location = {
    city,
    state,
    lat,
    long
  };
  apartment.rules = {
    rules,
    smoking,
    pets
  };
  apartment.amenities = {
    general: {
      wifi,
      tv,
      ac,
      heating,
      parking,
      adapted
    },
    bathroom: {
      hairdryer,
      shampoo,
      soap,
      hotwater
    },
    bedroom: {
      essentials,
      hangers,
      bedlinen,
      wardrobe
    },
    kitchen: {
      stove,
      fridge,
      microwave,
      tableware,
      coffeemaker,
      toaster,
    },
    outdoor: {
      balcony,
      garden,
      pool,
      barbicue,
      digningarea,
    },
  };
  apartment.photo1 = {
    url: photourl1,
    description: photodescr1
  };
  apartment.photo2 = {
    url: photourl2,
    description: photodescr2
  };
  apartment.photo3 = {
    url: photourl3,
    description: photodescr3
  };
  apartment.photo4 = {
    url: photourl4,
    description: photodescr4
  };
  apartment.photo5 = {
    url: photourl5,
    description: photodescr5
  };
  await apartment.save();
  res.redirect(`/admin/user/${req.userId}/apartments`);
}

exports.getViewApartment = async (req, res) => {
  let user = req.user ? req.user : false;

  try {
    const apartment = await Apartment.findById(req.params.apartment).populate("owner", "-__v");
    res.status(200).render('view-apartment.ejs', {
      user,
      apartment
    })
  } catch (err) {
    res.status(400).render('error.ejs', {
      error: err
    })
  }
};

exports.postSearchResults = async (req, res) => {
  let user = req.user ? req.user : false;

  var {
    city,
    state,
    checkin,
    checkout,
    guests
  } = req.body;

  //console.log(req.body);

  var message = "";

  // if no checkin date, set today's date
  if (!checkin) {
    checkin = moment().format("YYYY-MM-DD");
  }
  // if no checkout date, set today's date + 1
  if (!checkout) {
    checkout = moment(checkin).add(1, "days").format("YYYY-MM-DD");
  }
  // if no guests, set 1
  if (!guests) {
    guests = 1;
  }

  var apartments = await Apartment.find({

    $and: [{
        'location.city': city
      },
      {
        'location.state': state
      },
      {
        'capacity': {
          $gte: guests
        }
      },
      {
        'availablefrom': {
          $lte: checkin
        }
      },
      {
        'availableto': {
          $gte: checkout
        }
      },
    ]
  });


  //if no results, search all apartments in that state
  if (apartments.length > 0) {
    message = `we've found something for you!`;
  } else {
    apartments = await Apartment.find({
      'location.state': state
    });
    message = `The search didn't match any results, but we found something in the province of ${state} that you might be interested in.`;
  }

  if (apartments.length === 0) {
    apartments = await Apartment.find();
    message = `We didn't found any apartment in the province of ${state}. We have some in the rest of Catalunya`;
  }
  //console.log(message);
  res.status(200).render('search-results.ejs', {
    user,
    apartments,
    message
  })

}

exports.postBookApartment = async (req, res) => {
  const {
    checkin,
    checkout,
    guests
  } = req.body;

  var error = undefined;
  var message = "";

  const user = await User.findById(req.userId);


  if (!error && !(checkin || checkout)) {
    error = true;
    message = "Check in and Check out dates are required";
  }

  if (!error && moment(checkin).isAfter(moment(checkout))) {
    error = true;
    message = "Check in date must be before Check out date";
  }

  if (!error && moment(checkin).isBefore(moment())) {
    error = true;
    message = "Check in date must be after today";
  }

  if (!error && !guests) {
    error = true;
    message = "Number of guests is required";
  }

  if (!error && !req.userId) {
    error = true;
    message = "You must be logged in to book an apartment";
  }

  const apartment = await Apartment.findById(req.params.apartment);
  const availablefrom = apartment.availablefrom;
  const availableto = apartment.availableto;
  const capacity = apartment.capacity;


  //search if the number of guests is less than the number of guests available in the apartment
  if (!error && guests > capacity) {
    error = true;
    message = "There are not enough rooms available for the number of guests you want to book";
  }

  let chekinOk = moment(checkin).isBetween(availablefrom, availableto);
  let checkoutOk = moment(checkout).isBetween(availablefrom, availableto);

  //console.log("chekinOk: " + chekinOk);
  //console.log("checkoutOk: " + checkoutOk);

  // search if the checkin and checkout dates are available in the apartment
  if (!error && !chekinOk) {
    error = true;
    message = `Checkin is not available. Checkin must be between ${moment(availablefrom).format("DD/MM/YYYY")} and ${moment(availableto).format("DD/MM/YYYY")}`;

  }
  if (!error && !checkoutOk) {
    error = true;
    message = `Checkout is not available. Checkout must be between ${moment(availablefrom).format("DD/MM/YYYY")} and ${moment(availableto).format("DD/MM/YYYY")}`;
  }


  if (error) {
    res.status(200).render('booking-result.ejs', {
      apartment,
      error,
      message
    });
  } else {

    //search in the database if there is already a reservation for that apartment in that period of time
    const bookings = await Booking.find({
      $and: [{
          apartment: apartment._id
        },
        {
          $or: [{
              $and: [{
                  checkin: {
                    $gte: moment(checkin).toDate()
                  }
                },
                {
                  checkin: {
                    $lte: moment(checkout).toDate()
                  }
                }
              ]
            },
            {
              $and: [{
                  checkout: {
                    $gte: moment(checkin).toDate()
                  }
                },
                {
                  checkout: {
                    $lte: moment(checkout).toDate()
                  }
                }
              ]
            },
            //also check if the state is "pending" or "approved"
            {
              $and: [{
                  state: "pending"
                },
                {
                  state: "approved"
                }
              ]
            }
          ]
        }
      ]
    });



    if (bookings.length > 0) {
      error = true;
      message = "There is already a booking for this apartment in this period of time";
      res.status(200).render('booking-result.ejs', {
        apartment,
        error,
        message
      });
    } else {
      const booking = new Booking({
        user: req.userId,
        apartment: apartment._id,
        checkin: moment(checkin).toDate(),
        checkout: moment(checkout).toDate(),
        guests: guests,
        state: "pending"
      });
      await booking.save();
      message = "Your booking has been sent to the owner of the apartment. You will be notified by email when the owner accepts or rejects your booking";
      res.status(200).render('booking-result.ejs', {
        apartment,
        error,
        message
      });
      const emailMessage = `<h1>You have a new booking!</h1>
      <p>Hi ${user.name},</p>
      <p>You have a new booking for the apartment <strong>${apartment.title}</strong></p>
      <p><strong>Checkin:</strong> ${moment(checkin).format("DD/MM/YYYY")}</p>
      <p><strong>Checkout:</strong> ${moment(checkout).format("DD/MM/YYYY")}</p>
      <p><strong>Number of guests:</strong> ${guests}</p>
      <p>You can check the details of your booking in your profile</p>
      <p>Please remember that your booking is waiting for approval from the owner of the apartment</p>
      <p>Thanks,</p>`;

      eMail.sendEmail(user.name, user.email, "You have a new booking at Unique Apartments", emailMessage)
        .catch((error) => console.log(error.message));
    }
  }
}

exports.postDeleteApartment = async (req, res) => {
  //check if the user is the owner of the apartment or admin
  const apartment = await Apartment.findById(req.params.apartment);
  if (apartment.owner == req.userId || req.isAdmin) {
    const user = await User.findById(req.userId);
    await Apartment.findByIdAndDelete(req.params.apartment);
    res.redirect(`/admin/user/${req.body.userId}/apartments`);
    const emailMessage = `
     <h1>Your apartment has been deleted!</h1>
     <p>Hi ${user.name},</p>
     <p>Your apartment <strong>${apartment.title}</strong> has been deleted from our database.</p>
     <p>Thanks,</p>`;
    eMail.sendEmail(user.name, user.email, "Your apartment has been deleted", emailMessage);

  } else {
    res.status(400).render('error.ejs', {
      error: "Error: Page not found or not authorized"
    })
  }
}