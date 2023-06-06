import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('should render content', () => {
  const blog = { title: 'asdf', url:'qwerty', author: { name:'john', username:'john1' }, likes: 0 }

  const component = render(<Blog blog={blog}/>)

  expect(component.container).toHaveTextContent(blog.title)
  expect(component.container).toHaveTextContent(blog.author.name)
  expect(component.container).not.toHaveTextContent(blog.url)
})

test('should show url and likes after toggle', () => {
  const blog = { title: 'asdf', url:'qwerty', author: { name:'john', username:'john1' }, likes: 0 }
  const user = { username: 'blob' }

  const component = render(<Blog blog={blog} user={user} />)
  const button = component.container.querySelector('.toggle')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(blog.url)
  expect(component.container).toHaveTextContent(blog.likes)
})

test('should like blog when like button is clicked', () => {
  const blog = { title: 'asdf', url:'qwerty', author: { name:'john', username:'john1' }, likes: 0 }
  const user = { username: 'blob' }

  const mockHandler = jest.fn()

  const component = render(<Blog blog={blog} user={user} updateBlog={mockHandler} />)
  const button = component.container.querySelector('.toggle')
  fireEvent.click(button)

  const like = component.getByText('like')
  fireEvent.click(like)
  fireEvent.click(like)

  expect(mockHandler.mock.calls).toHaveLength(2)
})