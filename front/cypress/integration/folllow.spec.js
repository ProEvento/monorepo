/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.window().then(win => {
        win.sessionStorage.clear();
      });
      cy.clearLocalStorage()
      cy.clearCookies()
    })

    it('.vist() - visit home', () => {
      cy.visit('http://localhost:3000')
      
      // Sign in
      cy.get('#loginButton').last().click()
      cy.get('#username').click().type('jhaeju20@gmail.com')
      cy.get('#password').click().type('testuser123!')
      cy.get('button[type*="submit"]').first().click()

      // Visit user, follow, then unfollow
      cy.visit('http://localhost:3000/user/maxattack')
      cy.get('#followButton').click()
      cy.wait(1000)
      cy.visit('http://localhost:3000/user/maxattack')
      cy.get("#unfollowButton").click()
      cy.wait(1000)
      cy.visit('http://localhost:3000/user/maxattack')
      cy.get('#followButton').should('have.text', 'Follow')
      cy.get('#logoutButton').last().click()
    })
  })
  