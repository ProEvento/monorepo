/// <reference types="cypress" />

context('Actions', () => {
    beforeEach(() => {
    //   cy.clearLocalStorage()
    //   cy.clearCookies()
    })

    it('.vist() - visit home', () => {
      cy.visit('http://localhost:3000')

      cy.get('#loginButton').last().click()

      cy.get('#username').click().type('jhaeju20@gmail.com')
      cy.get('#password').click().type('testuser123!')
      cy.get('button.c8b93fbb9').click()
      cy.get('a[href*="events"]').first().click()
      cy.get('a[href*="event/"]').first().click()
      cy.wait(2000)
      cy.get('a[href*="meeting/"]').first().click()
      cy.get('#start').first().click()
      cy.wait(5000)
      cy.get('#logoutButton').click()
    //   cy.get('#newEvent').first().click()
    //   cy.get('#title').click().type('MyCoolEventForTestingPurposes')
    //   cy.get('#description').click().type('We will see this desription displayed')
    //   cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
    // //   cy.get('#rdt').select('')
    //   cy.get('[class="form-control"]').click()
    //   cy.get('[class="rdtPicker"]').click('center')
    //   cy.get('body').click(0,0);
    //   cy.get('#save').click()
    //   cy.wait(5000)
    //   cy.get('#logoutButton').click()

    //   cy.get('form-control').click()
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
  