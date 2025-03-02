const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "superuser",
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = { username: "test", name: "test_name", password: "qwerty" };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper status code and message if username already exists", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = { username: "root", name: "test_name", password: "asdfgh" };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test("creation fails if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = { username: "root", name: "test_name", password: "aa" };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("invalid password");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
