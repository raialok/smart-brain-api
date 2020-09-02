const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

app.use(express.json());
app.use(cors());

let database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 3,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Luigi Munch",
      email: "luigi.munch@yahoo.com",
      password: "cheese",
      entries: 5,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      email: "john@gmail.com",
      hash: "",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  let { email, name, password } = req.body;
  let hashedPassword = "";
  bcrypt.hash(password, null, null, function (err, hash) {
    hashedPassword = hash;
    console.log(hashedPassword);
    database.users.push({
      id: 125,
      name: name,
      email: email,
      entries: 0,
      joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(id);
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

// -> / = this is working
// -> /sign in => POST = success or fail
// -> /register => POST = success or fail
// -> /profile/:userID -> Get = user
// -> /image -> PUT -> user count
