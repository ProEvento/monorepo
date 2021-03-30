import makeServerCall from '../../lib/makeServerCall';

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

      // Visit user, click following users, following topics, events hosted, events attending
      cy.visit('http://localhost:3000/user/maxattack')

      cy.get('#eventsHosted').click()
      // cy.get('.eventsHosted').first().should('have.text', 'Yoyo max')
      cy.get('.eventsHosted').its('length').should('be.gte',1)

      cy.get('#closeButton').click()

      cy.get('#logoutButton').last().click()

    })
  })
  