const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("author", {
    username: 1,
    name: 1,
  });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id)
    return res.status(401).json({ error: "missing or invalid token" });
  const user = await User.findById(decodedToken.id).populate("blogs", {
    username: 1,
    name: 1,
  });

  const blog = await new Blog({
    author: user._id,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
  }).populate("author", { title: 1, url: 1, likes: 1 });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) res.status(404);
  res.json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404);

  const { id: userid } = jwt.verify(req.token, process.env.SECRET);
  if (blog.author.toString() !== userid.toString())
    return res.status(401).json({ error: "missing or invalid token" });

  await blog.delete();
  res.status(204).json(blog);
});

blogsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const blog = await Blog.findById(id);
  if (!blog) return res.status(404);

  const { id: userid } = jwt.verify(req.token, process.env.SECRET);
  if (blog.author.toString() !== userid.toString())
    return res.status(401).json({ error: "missing or invalid token" });

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: blog._id },
    {
      title: body.title,
      url: body.url,
      likes: body.likes,
    },
    { new: true }
  ).populate("author", { username: 1, name: 1 });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
