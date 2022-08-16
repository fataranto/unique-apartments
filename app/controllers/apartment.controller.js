const db = require("../models");
const User = db.user;
const Apartment = db.apartment;


exports.getAllApartments = async (req, res) => {
  let user = false;
  if (req.userId) {
    //user = await User.findById(req.userId).populate("roles", "-__v");
    user = {
      id: req.userId,
      username: req.userUsername
    }
  }

  const apartments = await Apartment.find().sort({
    price: 1
  });

  res.status(200).render('index.ejs', {
    user,
    apartments
  })
}


exports.getAddApartment = async (req, res) => {
  let user = false;
  if (req.userId) {
    //user = await User.findById(req.userId).populate("roles", "-__v");
    user = {
      id: req.userId,
      username: req.userUsername
    }
  }
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
    coffemaker,
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
    photodescr1,
    photodescr2,
    photodescr3,
    photodescr4
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
        coffemaker,
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
    owner: req.userId
  });

  console.log("apartment: ", apartment)

  await apartment.save();
  res.redirect("/");

}


exports.getEditApartment = async (req, res) => {
  let user = false;
  if (req.userId) {
    //user = await User.findById(req.userId).populate("roles", "-__v");
    user = {
      id: req.userId,
      username: req.userUsername
    }
  }
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
    coffemaker,
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
    photodescr1,
    photodescr2,
    photodescr3,
    photodescr4
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
      coffemaker,
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
  await apartment.save();
  res.redirect("/");
}

exports.getViewApartment = async (req, res) => {
  let user = false;
  if (req.userId) {
    user = {
      id: req.userId,
      username: req.userUsername
    }
  }

  const apartment = await Apartment.findById(req.params.apartment);
  //console.log(apartment)

  res.status(200).render('view-apartment.ejs', {
    user,
    apartment
  })

  //${req.params.user}  ${req.userId} -> de aquí puedo coger la ruta de usuario y el id
};

exports.postSearchResults = async (req, res) => {
  let user = false;
  if (req.userId) {
    user = {
      id: req.userId,
      username: req.userUsername
    }
  }

  const {
    city,
    state,
    checkin,
    checkout,
    guests
  } = req.body;

  const apartments = await Apartment.find({

        $and:[
          {'location.city': city},
          {'location.state': state},
          {'capacity': {$gte: 2}},
          {'availablefrom': {$lte: checkin}},
          {'availableto': {$gte: checkout}},
        ]             
      });

  console.log(apartments);

  //si no hay resultados busco todos los apartamentos de ese state
   if (apartments.length === 0) {
    const apartments = await Apartment.find({
      'location.state': state
    });
    const message = `La búsqueda no ha devuelto resultados, pero hemos encontrado los siguientes apartamentos en ${state}:`;
    console.log(message);
    console.log(apartments);
    res.send(`<h3>${message}<h3><p>${apartments}</p>`);
  } else {
    const message = `La búsqueda ha devuelto resultados:`;
    console.log(message);
    console.log(apartments);
    res.send(`<h3>${message}<h3><p>${apartments}</p>`);
  } 
}