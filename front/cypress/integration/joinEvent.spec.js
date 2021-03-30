/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
      cy.window().then(win => {
        win.sessionStorage.clear();
      });
      cy.clearLocalStorage()
      cy.clearCookies()
    })

    let random = Math.round(Math.random()* 1000000)

    it('.vist() - visit home', () => {
      
      // Sign up with first user
      cy.visit('http://localhost:3000')
      cy.get('#loginButton').last().click()
      cy.contains("Sign up").last().click()
      
      cy.get('#username').click().type('testuser' + random)
      cy.get('#email').click().type('testuser' + random + '@gmail.com')
      cy.get('#password').click().type('testuser123!')

      cy.get('button[type*="submit"]').first().click()
      cy.get('button[value*="accept"]').first().click()

      cy.get("#firstName").click().clear().type("RandFirst")
      cy.get("#lastName").click().type("RandLast")
      cy.get("#username").click().type("testuser" + random)
      cy.get("#linkedin").click().type("linkedin/" + random)
      cy.get("#github").click().type("githubUser" + random)
      cy.get("#twitter").click().type("twitteruser" + random)
      cy.get("#bio").click().type("rand bio")
      cy.get(".MuiButton-root").click()
      
      // Find event and join
      cy.visit('http://localhost:3000/explore')
      cy.get('#outlined-basic').last().type('Meeting120')
      cy.get('#search').click()
      cy.get('#visitButton').click()
      cy.get('.makeStyles-button-1').click()
      cy.reload()
      cy.get('#joinButton').click()

      cy.wait(10000)
      cy.get('#logoutButton').last().click()
      // Grab text and grab link to visit

    })
  })
  