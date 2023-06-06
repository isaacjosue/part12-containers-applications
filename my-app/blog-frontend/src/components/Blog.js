import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const [showDetail, setShowDetail] = useState(false)

  const toggle = () => setShowDetail(!showDetail)

  const like = () => {
    updateBlog(blog.id, {
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
    })
  }

  const remove = () => {
    removeBlog(blog.id)
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author.name}
        <button className='toggle' onClick={toggle}>{showDetail ? 'hide' : 'show'}</button>
        {showDetail && (
          <>
            <div className='url'>{blog.url}</div>
            <div className='likes'>
              {blog.likes} {user ? <button onClick={like}>like</button> : null}
            </div>
            <div>{blog.author.name}</div>
            {(user && blog.author.username === user.username) && (
              <button onClick={remove}>remove</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Blog
