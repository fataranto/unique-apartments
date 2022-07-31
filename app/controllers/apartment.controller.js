const db = require("../models");
const User = db.user;
const Apartment = db.apartment;


exports.getAllApartments = async (req, res) => {
  let user = false;
  if(req.userId) {
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
  if(req.userId) {
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

  console.log("apartment: ",apartment)

  await apartment.save();
  res.redirect("/");

}


exports.getEditApartment = async (req, res) => {
  let user = false;
  if(req.userId) {
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

exports.getViewApartment = async (req, res) => {
  let user = false;
  if(req.userId) {
    //user = await User.findById(req.userId).populate("roles", "-__v");
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