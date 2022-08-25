const { authJwt } = require("../middlewares");
const controller = require("../controllers/message.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/message/send", [authJwt.verifyToken], controller.postSendMessage);
  //creo una ruta para recuprar la conersacion entre dos usuarios
  app.post("/message/conversation", [authJwt.verifyToken], controller.postConversation);
};
