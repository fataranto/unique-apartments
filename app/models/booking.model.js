const mongoose = require("mongoose");

const Booking = mongoose.model(
  "Booking",
  new mongoose.Schema({
    checkin: Date,
    checkout: Date,
    guests: Number,
    state: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending"
    },
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
