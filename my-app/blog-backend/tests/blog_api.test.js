const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("test with existing blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("blogs have defined id", async () => {
    const { body: blogs } = await api.get("/api/blogs");
    blogs.map((blog) => expect(blog.id).toBeDefined());
  });
});

describe("test with new blog", () => {
  const login = async () => {
    const newUser = {
      username: "test",
      name: "test",
      password: "qwerty",
    };

    await api.post("/api/users").send(newUser);
    const response = await api
      .post("/api/login")
      .send({ username: newUser.username, password: newUser.password });

    return response.body.token;
  };

  test("blog with valid data can be added", async () => {
    const newBlog = { title: "test", url: "test", likes: 2 };
    const token = await login();

    await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const title = blogsAtEnd.map((blog) => blog.title);
    expect(title).toContain("test");
  });
  test("blog with no likes has 0 likes by default", async () => {
    const newBlog = { title: "test", url: "test" };
    const token = await login();

    const { body: blog } = await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(newBlog);

    expect(blog.likes).toBe(0);
  });
  test("blog with invalid data is not saved", async () => {
    const invalidBlog = { title: "no-url" };
    const token = await login();

    await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(invalidBlog)
      .expect(400);
  });
  test("blog can be fetched", async () => {
    const newBlog = { title: "test", url: "test", author: "user", likes: 2 };
    const token = await login();

    const {
      body: { id: blogId },
    } = await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(newBlog);

    await api
      .get(`/api/blogs/${blogId}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("blog can be updated", async () => {
    const newBlog = { title: "test", url: "test", likes: 2 };
    const token = await login();

    const {
      body: { id: blogId },
    } = await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(newBlog);

    const { body: blog } = await api
      .put(`/api/blogs/${blogId}`)
      .auth(token, { type: "bearer" })
      .send({ likes: 3 }).expect(200)
    
    expect(blog.likes).toBe(3);
  });
  test("blog can be deleted", async () => {
    const newBlog = { title: "test", url: "test", likes: 2 };
    const token = await login();

    const {
      body: { id: blogId },
    } = await api
      .post("/api/blogs")
      .auth(token, { type: "bearer" })
      .send(newBlog);

    await api
      .delete(`/api/blogs/${blogId}`)
      .auth(token, { type: "bearer" })
      .expect(204);

    await api.get(`/api/blogs/${blogId}`).expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
