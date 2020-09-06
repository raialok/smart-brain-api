const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// require("dotenv").config();

const db = knex({
  client: "pg",
  connection: {
    host: "postgresql-metric-51492",
    user: "alokrai",
    password: "",
    database: "smart-brain",
  },
});

app.use(express.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send(db.users);
// });

app.get("/", (req, res) => {
  res.send("cool");
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, db);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", image.handleApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
