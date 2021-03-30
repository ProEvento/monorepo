/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
    //   cy.clearLocalStorage()
    //   cy.clearCookies()
    })

    it('.vist() - visit home', () => {
      cy.visit('http://localhost:3000')

      cy.get('#loginButton').last().click()

      cy.get('#username').click().type('testuser57588@gmail.com')
      cy.get('#password').click().type('testuser123!')
      cy.get('button').first().click()
      cy.get('a[href*="events"]').first().click()
      cy.get('#newEvent').first().click()
      cy.get('#title').click().type('MyCoolEventForTestingPurposes')
      cy.get('#description').click().type('We will see this desription displayed')
      cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
    //   cy.get('#rdt').select('')
      cy.get('[class="form-control"]').click()
      cy.get('[class="rdtPicker"]').click('center')
      cy.get('body').click(0,0);
      cy.get('#save').click()
      cy.location('pathname').should('include', 'event')

      cy.wait(5000)
      cy.get('#logoutButton').click()
    })    
  })
  