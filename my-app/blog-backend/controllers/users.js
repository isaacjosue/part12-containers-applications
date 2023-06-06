const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;

  if (!body.password || body.password.length < 3)
    return res.status(400).send({ error: "invalid password" });
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404);
  res.json(user);
});

usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  res.status(204).json(user);
});

usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const user = await User.findByIdAndUpdate(
    id,
    {
      username: body.username,
      name: body.name,
      url: body.url,
      likes: body.likes,
    },
    { new: true }
  );
  res.json(user);
});

module.exports = usersRouter;
