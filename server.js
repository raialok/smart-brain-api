const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "alokrai",
    password: "",
    database: "smart-brain",
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(db.users);
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, db);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      user.length
        ? res.status(400).json("not found")
        : res.status(400).json("not found");
    })
    .catch((err) => res.status(400).json("not found"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries);
    })
    .catch((err) => res.json("Unable to get entries"));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// -> / = this is working
// -> /sign in => POST = success or fail
// -> /register => POST = success or fail
// -> /profile/:userID -> Get = user
// -> /image -> PUT -> user count
