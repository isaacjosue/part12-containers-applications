import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<NoteForm> should update parent state and call onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(<BlogForm createBlog={createBlog}/>)

  const title = component.container.querySelectorAll('input')[0]
  const url = component.container.querySelectorAll('input')[1]
  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: 'testing could be easier' } })
  fireEvent.change(url, { target: { value: 'example.com' } })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing could be easier')
})