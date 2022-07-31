const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id; //guardo el id del usuario (es el identificador único de la colección users)
    req.userUsername = decoded.username; //guardo el username del usuario
    next();
  });
};

verifyTokenPublic = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return next()
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if(decoded !== undefined){
      req.userId = decoded.id; 
      req.userUsername = decoded.username;
      return next();
    }
    return next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isHost = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "host" || roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Host or Admin Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  verifyTokenPublic,
  isAdmin,
  isHost,
};
module.exports = authJwt;
