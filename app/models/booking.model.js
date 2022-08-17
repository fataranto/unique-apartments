const mongoose = require("mongoose");

const Booking = mongoose.model(
  "Booking",
  new mongoose.Schema({
    checkin: Date,
    checkout: Date,
    guests: Number,
    state: String, //pending, confirmed, cancelled
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  })
);

module.exports = Booking;
