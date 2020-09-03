const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");

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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("invalid credentials"));
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
