const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.apartment = require("./apartment.model");
db.booking = require("./booking.model");

db.ROLES = ["user", "admin", "host"];

module.exports = db;
