const mongoose = require("mongoose");

const Apartment = mongoose.model(
  "Apartment",
  new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    availablefrom: Date,
    availableto: Date,
    capacity: Number,
    rooms: Number,
    bathrooms: Number,
    meters: String,
    location: {
        city: String,
        state: String,
        lat: Number,
        long: Number
    },
    rules: {
        rules: String,
        smoking: {type: Boolean, default: false},
        pets: {type: Boolean, default: false}
    },
    amenities: {
        general: {
            wifi: {type: Boolean, default: false},
            tv: {type: Boolean, default: false},
            ac: {type: Boolean, default: false},
            heating: {type: Boolean, default: false},
            parking: {type: Boolean, default: false},
            adapted: {type: Boolean, default: false}

        },
        bathroom: {
            hairdryer: {type: Boolean, default: false},
            shampoo: {type: Boolean, default: false},
            soap: {type: Boolean, default: false},
            hotwater: {type: Boolean, default: false}
        },
        bedroom: {
            essentials: {type: Boolean, default: false},
            hangers: {type: Boolean, default: false},
            bedlinen: {type: Boolean, default: false},
            wardrobe: {type: Boolean, default: false}
        },
        kitchen: {
            stove: {type: Boolean, default: false},
            fridge: {type: Boolean, default: false},
            microwave: {type: Boolean, default: false},
            tableware: {type: Boolean, default: false},
            coffeemaker: {type: Boolean, default: false},
            toaster: {type: Boolean, default: false}
        },
        outdoor: {
            balcony: {type: Boolean, default: false},
            garden: {type: Boolean, default: false},
            pool: {type: Boolean, default: false},
            barbicue: {type: Boolean, default: false},
            digningarea: {type: Boolean, default: false}
        },
    },
    photo1: {
        url: String,
        description: String
    },
    photo2: {
        url: String,
        description: String
    },
    photo3: {
        url: String,
        description: String
    },
    photo4: {
        url: String,
        description: String
    },
    photo5: {
        url: String,
        description: String
    },
    owner: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
  })
);

module.exports = Apartment;
