const { authJwt } = require("../middlewares");
const controller = require("../controllers/apartment.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/apartment/new-apartment", [authJwt.verifyToken, authJwt.isHost], controller.getAddApartment);