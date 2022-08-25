const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    apartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
    messageText: String
  })
);

module.exports = Message;
