const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return sortedBlogs[0] || {};
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, "author");
  const parsedAuthors = _.map(authors, (value, key) => ({
    author: key,
    blogs: value,
  }));
  const sortedAuthors = _.sortBy(parsedAuthors, (author) => author.blogs);
  return sortedAuthors[sortedAuthors.length - 1] || {};
};

const mostLikes = (blogs) => {
  const reducedBlogs = _.reduce(
    blogs,
    (prev, blog) => {
      const result = prev;
      result[blog.author]
        ? (result[blog.author] += blog.likes)
        : (result[blog.author] = blog.likes);
      return result;
    },
    {}
  );
  const parsedBlogs = _.map(reducedBlogs, (value, key) => ({
    author: key,
    likes: value,
  }));
  const sortedBlogs = _.sortBy(parsedBlogs, (author) => author.likes);
  return sortedBlogs[sortedBlogs.length - 1] || {};
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
