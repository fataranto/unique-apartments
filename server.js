const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require('path');

const dbConfig = require("./app/config/db.config");

const app = express();

// agrego para verificar si hay un usuario conectado en el endpoint "/", para poder coger su nombre y agregarlo al menú
const { authJwt } = require("./app/middlewares");

const controller = require("./app/controllers/apartment.controller");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


 

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "unique-appartments",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);





const db = require("./app/models");
const Role = db.role;
const User = db.user;

db.mongoose
  .connect(`mongodb+srv://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// index route
app.get("/", [authJwt.verifyTokenPublic], controller.getAllApartments);





// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/apartment.routes")(app);

app.use((req, res) =>{
  res.status(404).render('error.ejs', 
      { error: "Error: The page you're looking for doesn't exist!" 
      });
  });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "host"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'host' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
