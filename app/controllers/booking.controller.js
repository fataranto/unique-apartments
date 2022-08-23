const db = require("../models");
const User = db.user;
const Apartment = db.apartment;
const Booking = db.booking;
const moment = require('moment');
const eMail = require("../middlewares/sendEmail");
const { appengine } = require("googleapis/build/src/apis/appengine");

exports.getAproveBooking = async (req, res) => {
    console.log("req.params.booking",req.params.booking);
    const booking = await Booking.findById(req.params.booking);
    console.log("booking",booking);
    booking.state = "approved";
    await booking.save();
    res.redirect(`/admin/user/${req.userId}/bookings`);
}


exports.getRejectBooking = async (req, res) => {
    console.log("req.params.booking",req.params.booking);
    const booking = await Booking.findById(req.params.booking);
    console.log("booking",booking);
    booking.state = "rejected";
    await booking.save();
    res.redirect(`/admin/user/${req.userId}/bookings`);
}
