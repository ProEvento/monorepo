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
      cy.visit('http://localhost:3000/user/elissaperdue')

      cy.get('#followingUsers').click()
      cy.wait(5000)
      // cy.get('h4').last().should('have.text', 'Maxwell Woehrmann')
      cy.get('[class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary"]').its('length').should('be.gte',1)
      // [class="form-control"]
      cy.get('#closeButton').click()

      cy.get('#logoutButton').last().click()

    })
  })
  