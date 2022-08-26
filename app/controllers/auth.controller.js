const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
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

      //add this functionality to ser the session expirement time to 7 days if the cuser check the remember me checkbox
      //if not set the session expirement time to 1 day
      const expiresIn = req.body.rememberMe ? "7d" : 86400; // 86400 = 1 day

      //console.log("rememberMe: ", req.body.rememberMe);

      var authorities = [];

      //save the user roles in the session
      const isAdmin = user.roles.some((role) => role.name === "admin");
      //console.log("isAdmin: ", isAdmin);
      const isHost = user.roles.some((role) => role.name === "host");


     user.roles.forEach((role) => {
        authorities.push("ROLE_" + role.name.toUpperCase());
      });

      var token = jwt.sign({ id: user.id, username: user.username, isAdmin: isAdmin, isHost: isHost }, config.secret, {
        expiresIn: expiresIn, 
      });


      //console.log("authorities: ", authorities);

      req.session.token = token;
      //login is called using fetch in the frontend
      res.status(200).json({
        message: "User successfully Logged in",
        user: user.id,
      });

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
  name,
  lastname,
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
      
    });
  });
}

res.status(200).json({ message: "User updated successfully!" }); 
};

