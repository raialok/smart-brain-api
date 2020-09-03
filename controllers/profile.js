const handleProfile = (req, res, db) => {
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
};

module.exports = {
  handleProfile: handleProfile,
};
