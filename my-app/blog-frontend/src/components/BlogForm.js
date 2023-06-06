import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    createBlog({ title, url })

    setTitle('')
    setUrl('')
  }

  return (
    <div className='formDiv' >
      <h2>make new blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          id="title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Title"
        />
        <input
          value={url}
          id="url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder="URL"
        />
        <button id="submit">Submit</button>
      </form>
    </div>
  )
}

export default BlogForm
