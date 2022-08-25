const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Apartment = db.apartment;
const eMail = require("../middlewares/sendEmail");

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
      res.status(500).json({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).json({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).json({ message: err });
              return;
            }
            eMail.sendEmail(user.name, user.email, "Wellcome to Unique Apartments", 
            `<h1>Welcome to Unique Apartments</h1>
            <p>You have been registered in the system</p>
            <p>Username: ${user.username}</p>
            <p>Password: ${req.body.password}</p>
            <p>Please, login to the system</p>
            <p>Thanks</p>`)
            .then((result) => res.status(200).json({
              message: "User successfully registered",
              user: user.id,
            }))
            .catch((error) => console.log(error.message));

            
            //res.redirect("/");

          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).json({ message: err });
            return;
          }

          res.status(200).json({
            message: "User successfully registered",
            user: user.id,
          });

          //console.log("user 2: ", user);
          //res.send({ message: "User was registered successfully!" });

         // res.redirect("/");
          
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
    .exec(async (err, user) => {  
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).json({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid Password!" });
      }

      const expiresIn = req.body.rememberMe ? "7d" : 86400; // 86400 = 1 day

      //console.log("rememberMe: ", req.body.rememberMe);

      /* var token = jwt.sign({ id: user.id, username: user.username }, config.secret, {
        expiresIn: 86400, // 24 hours
      }); */

      var authorities = [];

      const isAdmin = user.roles.some((role) => role.name === "admin");
      //console.log("isAdmin: ", isAdmin);
      const isHost = user.roles.some((role) => role.name === "host");


      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      var token = jwt.sign({ id: user.id, username: user.username, isAdmin: isAdmin, isHost: isHost }, config.secret, {
        expiresIn: expiresIn, 
      });


      //console.log("authorities: ", authorities);

      req.session.token = token;

      //mostrar por consola la fecha de expiracion del token
      /* var expirationDate = (jwt.decode(token).exp)*1000;
      const date = new Date(expirationDate);
      console.log("Fecha de expiracion del token: ", date.toLocaleString()); */      

      res.status(200).json({
        message: "User successfully Logged in",
        user: user.id,
      });

      //res.redirect("/");

    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;

    res.redirect("/");
  } catch (err) {
    this.next(err);
  }
};

exports.userUpdate = async (req, res) => {
const {
  username,
  name,
  lastname,
  email,
  password,
  roles,
} = req.body;

const user = await User.findById (req.params.user);

if (!user) {
  return res.status(404).json({
    message: "User Not found.",
  });
}

user.name = name;
user.lastname = lastname;
user.password = bcrypt.hashSync(req.body.password, 8)

await user.save();

if (req.body.roles) {
  //console.log("roles: ", roles);
  Role.find(
    {
      name: { $in: req.body.roles },
    },
    (err, roles) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      user.roles = roles.map((role) => role._id);
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        //res.redirect("/");

      });
    }
  );
} else {
  Role.findOne({ name: "user" }, (err, role) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    user.roles = [role._id];
    user.save((err) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      res.status(200).json({
        message: "User updated successfully!",
        user: user.id,
      }); 


      //console.log("user 2: ", user);
      //res.send({ message: "User was registered successfully!" });

     // res.redirect("/");
      
    });
  });
}

res.status(200).json({ message: "User updated successfully!" }); 
};

