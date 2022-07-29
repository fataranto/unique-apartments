const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Apartment = db.apartment;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });


  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.redirect("/");

          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          console.log("user 2: ", user);
          //res.send({ message: "User was registered successfully!" });

          res.redirect("/");
          
        });
      });
    }
  });


};

exports.signin = (req, res) => {
  const user = User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {  //async (consultar Oscar)
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      //consultar OSCAR!!!
      const apartments = await Apartment.find().sort({
        price: 1
    });

      res.status(200).render("index.ejs",{
        user,
        apartments
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    let user = false;

    //consultar OSCAR!!!
    const apartments = await Apartment.find().sort({
      price: 1
  });

    return res.render('index.ejs', {
      user,
      apartments
    });
  } catch (err) {
    this.next(err);
  }
};