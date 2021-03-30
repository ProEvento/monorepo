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
      cy.get('#loginButton').last().click()
      cy.get('button[data-provider*="linkedin"]').first().click()
      cy.get('h1').first().should('have.text', 'Welcome Back')
    })
  })
  