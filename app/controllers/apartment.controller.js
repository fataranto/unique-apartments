const db = require("../models");
const User = db.user;
const Apartment = db.apartment;
const Booking = db.booking;
const moment = require('moment');



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
  // const user = await User.findById(req.userId).populate("roles", "-__v");
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
  console.log(req.body);

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

  console.log("apartment: ", apartment)

  await apartment.save();
  res.redirect("/");

}


exports.getEditApartment = async (req, res) => {
  let user = req.user ? req.user : false;
  //const user = await User.findById(req.userId).populate("roles", "-__v");
  const apartment = await Apartment.findById(req.params.apartment);
  console.log(apartment);
  res.status(200).render('new-apartment.ejs', {
    user,
    apartment
  })
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
  console.log(req.body);

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
  res.redirect("/");
}

exports.getViewApartment = async (req, res) => {
  let user = req.user ? req.user : false;

  try {
    const apartment = await Apartment.findById(req.params.apartment);
    res.status(200).render('view-apartment.ejs', {
      user,
      apartment
    })
  } catch (err) {
    res.status(400).send(err);
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

  console.log(req.body);

  var message = "";

  // si no hay fecha de entrada, se pone la fecha de hoy
  if (!checkin) {
    checkin = moment().format("YYYY-MM-DD");
  }
  // si no hay fecha de salida, se pone la fecha de entrada + 1 día
  if (!checkout) {
    checkout = moment(checkin).add(1, "days").format("YYYY-MM-DD");
  }
  // si no hay número de huéspedes, se pone 1
  if (!guests) {
    guests = 1;
  }

  var apartments = await Apartment.find({

        $and:[
          {'location.city': city},
          {'location.state': state},
          {'capacity': {$gte: guests}},
          {'availablefrom': {$lte: checkin}},
          {'availableto': {$gte: checkout}},
        ]             
      });


  //si no hay resultados busco todos los apartamentos de ese state
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
  /* console.log(req.body);
  console.log(req.params.apartment);
  console.log(req.userId); */
  
  //si la fecha de entrada es mayor que la fecha de salida, muesto error por consola
  if (moment(checkin).isAfter(moment(checkout))) {
    console.log("error, la fecha de entrada es mayor que la fecha de salida");
  }

//guardo un nuevo booking en la base de datos
  const booking = new Booking({
    apartment: req.params.apartment,
    user: req.userId,
    checkin,
    checkout,
    guests,
    state: "pending"
  });
  await booking.save();
  
  res.redirect("/");
}
