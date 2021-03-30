/// <reference types="cypress" />
  

  
      it('.searchbyuser() -search users', () => {
          cy.visit('http://localhost:3000')
    
          cy.get('#loginButton').last().click()
    
          cy.get('#username').click().type('jhaeju20@gmail.com')
          cy.get('#password').click().type('testuser123!')
          cy.get('button').first().click()
          cy.get('a[href*="explore"]').first().click()
          cy.get('#simple-tab-1').click(); 
          cy.get('#outlined-basic').click().type('elissaperdue')
          cy.get('#search').click()
          cy.get('a[href*="user/elissaperdue"]').first().click()  
          cy.location('pathname').should('include', 'elissaperdue')
          cy.get('a[href*="explore"]').first().click()
          cy.get('#simple-tab-1').click(); 
          cy.get('#outlined-basic').click().type('haeju')
          cy.get('#search').click()
          cy.get('a[href*="user/haeju"]').first().click()
          cy.location('pathname').should('include', 'haeju')
          cy.get('a[href*="explore"]').first().click()
          cy.get('#simple-tab-1').click(); 
          cy.get('#outlined-basic').click().type('carolynhuaaa')
          cy.get('#search').click()
          cy.get('a[href*="user/carolynhuaaa"]').first().click()
  
          cy.location('pathname').should('include', 'carolynhuaaa')
  
          cy.wait(1500)
          cy.get('#logoutButton').click()

        })
      
  
    
    