/// <reference types="cypress" />
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
context('Actions', () => {
    beforeEach(() => {
    //   cy.clearLocalStorage()
    //   cy.clearCookies()
    })

    it('.vist() - visit home', () => {
      cy.visit('http://localhost:3000')

      // cy.get('#loginButton').last().click()

      cy.get('#loginButton').last().click()
      cy.get('#username').click().type('testuser57588@gmail.com')
      cy.get('#password').click().type('testuser123!')
      cy.get('button').first().click()
      cy.get('a[href*="events"]').first().click()
      cy.get('#newEvent').first().click()
      let random_string1 = "Meeting_" + makeid(5);
      cy.get('#title').click().type(random_string1)
      cy.get('#description').click().type('We will see this desription displayed')
      cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
    //   cy.get('#rdt').select('')
      cy.get('[class="form-control"]').click()
      cy.get('[class="rdtPicker"]').click('center')
      cy.get('body').click(0,0);
      cy.get('#save').click()
      cy.location('pathname').should('include', 'event')
      cy.get('a[href*="events"]').first().click()
      cy.get('a[href*="event/"]').first().click()
      cy.wait(2000)
      cy.get('a[href*="meeting/"]').first().click()
      cy.get('#start').first().click()
      cy.wait(5000)
      cy.get('#logoutButton').click()
    })
    
  
    // it('.type() - type into a DOM element', () => {
      
    // })
    
    // it('.type() - type in login', () => {
      
    // })
    
    

  })
  