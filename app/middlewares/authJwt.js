const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

// check if user is logged in
verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).render('error.ejs', 
      { error: "Error: No token provided!" 
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).render('error.ejs', 
      { error: "Error: Unauthorized" 
    });
    }
    req.userId = decoded.id; 
    req.userUsername = decoded.username; 
    req.isAdmin = decoded.isAdmin; 
    req.isHost = decoded.isHost; 
    req.user = {
      id: decoded.id,
      username: decoded.username,
      isAdmin: decoded.isAdmin,
      isHost: decoded.isHost
    }
    next();
  });
};

// there some areas that are not protected by the middleware
verifyTokenPublic = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return next()
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if(decoded !== undefined){
      req.userId = decoded.id; 
      req.userUsername = decoded.username;
      req.isAdmin = decoded.isAdmin;
      req.isHost = decoded.isHost;
      req.user = {
        id: decoded.id,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
        isHost: decoded.isHost
      }
      //console.log(req.userId, req.userUsername, req.userRoles)

      return next();
    }
    return next();
  });
};

// only admin can access this
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).render('error.ejs', 
      { error: err 
    });
      
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).render('error.ejs', 
      { error: err 
    });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).render('error.ejs', {
          error: "Require Admin Role!"
        })
        return;
      }
    );
  });
};

// only admin or host can access this
isHost = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).render('error.ejs', 
      { error: err 
    });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).render('error.ejs', 
      { error: err 
    });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "host" || roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).render('error.ejs', 
      { error: "Error: Require Host or Admin Role" 
      });
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
