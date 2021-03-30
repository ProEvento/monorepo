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
      cy.get('button').first().click()
      cy.get('a[href*="explore"]').first().click()
      cy.get('#outlined-basic').click().type('test')
      cy.get('#search').click()

      cy.wait(1500)
    //   cy.get('#logoutButton').click()
  
    })
    it('.searchbydate() - visit home', () => {
        cy.visit('http://localhost:3000')
  
        cy.get('#loginButton').last().click()
  
        // cy.get('#username').click().type('jhaeju20@gmail.com')
        // cy.get('#password').click().type('testuser123!')
        // cy.get('button.c8b93fbb9').click()
        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-1').click(); 
        cy.get('#outlined-basic').click().type('elissaperdue')
        cy.get('#search').click()
  
        cy.wait(2000)
    
      })
      it('.searchbydate() - visit home', () => {
        cy.visit('http://localhost:3000')
  
        cy.get('#loginButton').last().click()
  
        // cy.get('#username').click().type('jhaeju20@gmail.com')
        // cy.get('#password').click().type('testuser123!')
        // cy.get('button').first().click()
        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-2').click(); 
        cy.get('[class="react-datepicker-wrapper"]').first().click()
        cy.wait(1000)
        cy.get('[class="react-datepicker"]').click('center')
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('[class="react-datepicker-wrapper"]').last().click()
        cy.wait(1000)

        cy.get('[class="react-datepicker__day react-datepicker__day--011"]').click()
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('#search').click()
  
        cy.wait(2000)


        cy.get('#logoutButton').click()
    
      })
    

  })
  