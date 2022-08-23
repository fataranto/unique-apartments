const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Testing routes
  //app.get("/api/test/all", controller.allAccess);

  //app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  //app.get("/api/test/host", [authJwt.verifyToken, authJwt.isHost], controller.hostBoard);

  //app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);


  // App routes
  app.get("/admin/user/:user", [authJwt.verifyToken], controller.userDashboard);
  app.get("/admin/user/:user/profile", [authJwt.verifyToken], controller.userDashboardProfile);
  app.get("/admin/user/:user/apartments", [authJwt.verifyToken], controller.userDashboardApartments);
  app.get("/admin/user/:user/bookings", [authJwt.verifyToken], controller.userDashboardBookings);
};
