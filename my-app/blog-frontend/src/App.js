import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notif, setNotif] = useState({})

  const blogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    (async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      } catch (err) {
        console.log(err.message)
      }
    })()
  }, [])

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      blogService.setToken(storedUser.token)
      setUser(storedUser)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      localStorage.setItem('user', JSON.stringify(user))

      setNotif({ message: 'Logged in' })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    } catch (err) {
      setNotif({ error: true, message: err.message })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addBlog = async (blogObj) => {
    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create(blogObj)
      setBlogs(blogs.concat(blog).sort((a, b) => b.likes - a.likes))

      setNotif({ message: 'Successfully created' })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    } catch (err) {
      setNotif({ error: true, message: err.message })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObj) => {
    try {
      const updatedBlog = await blogService.update(id, blogObj)
      const newBlogs = blogs.map((blog) => {
        if (blog.id === updatedBlog.id) {
          return updatedBlog
        }
        return blog
      })
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))

      setNotif({ message: 'Successfully updated' })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    } catch (err) {
      setNotif({ error: true, message: err.message })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(
        blogs.filter((blog) => blog.id !== id).sort((a, b) => b.likes - a.likes)
      )

      setNotif({ message: 'Successfully removed' })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    } catch (err) {
      setNotif({ error: true, message: err.message })
      setTimeout(() => {
        setNotif({})
      }, 5000)
    }
  }

  return (
    <div>
      {notif && (
        <div className={`notif ${notif.error && 'error'}`}>{notif.message}</div>
      )}

      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ))}

      {user ? (
        <>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Togglable buttonLabel="login" ref={loginFormRef}>
            <LoginForm
              handleLogin={handleLogin}
              setUsername={setUsername}
              setPassword={setPassword}
              username={username}
              password={password}
            />
          </Togglable>
        </>
      )}
    </div>
  )
}

export default App
