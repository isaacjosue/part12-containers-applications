describe('Blog app', function ()  {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'test',
      username: 'test_user',
      password: 'qwerty'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('should open front page', function()  {
    cy.contains('Blogs')
  })

  it('should fail to login with wrong password', function() {
    cy.contains('login').click()
    cy.get('#username').type('test')
    cy.get('#password').type('wrong')
    cy.get('#login').click()

    cy.get('.error')
    cy.get('html').should('not.contain', 'Logged in')
  })

  describe('when logged in', function () {
    beforeEach(function() {
      cy.login({ username: 'test_user', password:'qwerty' })
    })

    it('can make new blog', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('aaa')
      cy.get('#url').type('bbb')
      cy.get('#submit').click()
      cy.contains('aaa')
    })

    describe('and a blog exists', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'titletitletitle', url: 'urlurlurl' })
      })

      it('can be liked', function()  {
        cy.contains('show').click()
        cy.get('.likes').contains(0)

        cy.contains('like').click()

        cy.get('.likes').contains(1)
      })

      it('can be deleted by poster', function() {
        cy.contains('show').click()
        cy.contains('remove').click()

        cy.should('not.contain', 'titletitletitle')
        cy.contains('Successfully removed')
      })

      it('cannot be deleted by user who is not poster', function() {
        const user = {
          name: 'test2',
          username: 'test_user2',
          password: 'qwerty'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'test_user2', password: 'qwerty' })
        cy.contains('show').click()

        cy.should('not.contain', 'remove')
      })
    })

    describe('and multiple blogs exist', function()  {
      beforeEach(function() {
        cy.createBlog({ title:'first', url:'url1' })
        cy.createBlog({ title:'second', url:'url2' })
        cy.createBlog({ title:'third', url:'url3' })
      })

      it('should like one of them', function()  {
        cy.contains('second').contains('show').click()
        cy.contains('second').get('.likes').contains(0)
        cy.contains('second').contains('like').click()
        cy.contains('second').get('.likes').contains(1)
      })

      it('should show blogs by like order', function() {
        cy.contains('second').contains('show').click()
        cy.contains('second').contains('like').click()
        cy.contains('second').contains('like').click()
        cy.contains('first').contains('show').click()
        cy.contains('first').contains('like').click()

        cy.get('.blog').then(blogs => {
          const sortedBlogs = blogs.sort((a, b) => a.likes - b.likes)
          return sortedBlogs === blogs
        })
      })
    })
  })
})