const listHelper = require("../utils/list_helper");

const empty = [];
const single = [{ author: "a", likes: 2, title: "test1" }];
const list = [
  { author: "a", likes: 1, title: "test1" },
  { author: "b", likes: 2, title: "test2" },
  { author: "a", likes: 1, title: "test3" },
  { author: "b", likes: 3, title: "test4" },
  { author: "b", likes: 4, title: "test5" },
];

test("dummy returns 1", () => {
  const result = listHelper.dummy(empty);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("of empty list is 0", () => {
    const result = listHelper.totalLikes(empty);
    expect(result).toBe(0);
  });
  test("when list has only one blog equals likes of that blog", () => {
    const result = listHelper.totalLikes(single);
    expect(result).toBe(2);
  });
  test("of bigger list is calculated properly", () => {
    const result = listHelper.totalLikes(list);
    expect(result).toBe(11);
  });
});

describe("favorite blog", () => {
  test("of empty blog list is empty", () => {
    const result = listHelper.favoriteBlog(empty);
    expect(result).toEqual({});
  });
  test("when list has only one blog equals that blog", () => {
    const result = listHelper.favoriteBlog(single);
    expect(result).toEqual({ author: "a", likes: 2, title: "test1" });
  });
  test("of bigger list is calculated properly", () => {
    const result = listHelper.favoriteBlog(list);
    expect(result).toEqual({ author: "b", likes: 4, title: "test5" });
  });
});

describe("most blogs", () => {
  test("of empty blog list is empty", () => {
    const result = listHelper.mostBlogs(empty);
    expect(result).toEqual({});
  });
  test("when list has only one author equals that author", () => {
    const blogs = [{ author: "a" }, { author: "a" }];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "a", blogs: 2 });
  });
  test("of bigger list is calculated properly", () => {
    const result = listHelper.mostBlogs(list);
    expect(result).toEqual({ author: "b", blogs: 3 });
  });
});

describe("most likes", () => {
  test("of empty blog list is empty", () => {
    const result = listHelper.mostLikes(empty);
    expect(result).toEqual({});
  });
  test("when list has only one blog equals that blog", () => {
    const result = listHelper.mostLikes(single);
    expect(result).toEqual({ author: "a", likes: 2 });
  });
  test("of bigger list is calculated properly", () => {
    const result = listHelper.mostLikes(list);
    expect(result).toEqual({ author: "b", likes: 9 });
  });
});
