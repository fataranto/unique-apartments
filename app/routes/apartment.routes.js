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

  app.post("/apartment/new-apartment", [authJwt.verifyToken, authJwt.isHost], controller.postAddApartment);

  app.get("/apartment/:apartment/edit", [authJwt.verifyToken, authJwt.isHost], controller.getEditApartment);

  app.post("/apartment/:apartment/update", [authJwt.verifyToken, authJwt.isHost], controller.postUpdateApartment);

  app.get("/apartment/:apartment", [authJwt.verifyTokenPublic], controller.getViewApartment);

  app.post("/apartment/search-results", [authJwt.verifyTokenPublic], controller.postSearchResults);

};
