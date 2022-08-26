const db = require("../models");
const User = db.user;
const Apartment = db.apartment;
const Booking = db.booking;
const moment = require('moment');
const eMail = require("../middlewares/sendEmail");
const { appengine } = require("googleapis/build/src/apis/appengine");

exports.getUpdateBooking = async (req, res) => {
    //console.log("req.params.booking",req.params.booking);
    var newStatus;
    switch (req.query.q) {
        case "approved": newStatus = "approved"; break;
        case "rejected": newStatus = "rejected"; break;
        case "cancel": newStatus = "cancelled"; break;
        default: newStatus = "pending";
        break;
    }

    if (newStatus != "pending") {
    const booking = await Booking.findById(req.params.booking).populate("apartment").populate("user");
    //console.log("booking",booking);
    booking.state = newStatus;
    await booking.save();
    res.redirect('back');
    const emailMessage = `<h1>Your booking has been updated</h1>
    <p>Your booking for <strong>${booking.apartment.title}</strong> has been updated to <strong>${newStatus}</strong></p>
    <p>Please contact us if you have any questions</p>
    <p>Thank you</p>`;
    eMail.sendEmail(booking.user.name, booking.user.email, "Booking updated", emailMessage);
    } else {
        res.status(400).render('error.ejs', {
            error: "Bad request"
        });
    }
}

