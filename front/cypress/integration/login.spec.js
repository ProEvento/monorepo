/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.clearCookies()
    })

    it('.vist() - visit home', () => {
      cy.visit('http://localhost:3000')

      cy.get('#loginButton').last().click()

      cy.get('#username').click().type('jhaeju20@gmail.com')
      cy.get('#password').click().type('testuser123!')
      cy.get('button.c8b93fbb9').click()
      cy.get('#logoutButton').click()
      
      // const auth0State = {
      //   nonce: "", cy.get('span#username')
      //   state: "some-random-state"
      // }
    })

  
    // it('.type() - type into a DOM element', () => {
      
    // })
    
    // it('.type() - type in login', () => {
      
    // })
    
    

  })
  