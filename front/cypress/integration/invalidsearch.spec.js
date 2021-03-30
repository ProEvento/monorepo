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


function makeRandomInt(max) {
    
    var result = Math.floor(Math.random() * max) + 1  
    return result;
  
  }

  function makeRandomDay(max) {
    
    var result = Math.floor(Math.random() * max) + 1  
    if(result < 10){
        return 10;
    }
    return result;
  
  }

  
  context('Actions', () => {
      beforeEach(() => {
      //   cy.clearLocalStorage()
      //   cy.clearCookies()
      })
      it('.searchByEventName() - search event name', () => {
        cy.visit('http://localhost:3000')
        cy.get('#loginButton').last().click()
        cy.get('#username').click().type('testuser57588@gmail.com')
        cy.get('#password').click().type('testuser123!')
        cy.get('button').first().click()
        cy.get('a[href*="events"]').first().click()
        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-2').click(); 
        cy.get('[class="react-datepicker-wrapper"]').first().click()
        cy.wait(1000)
        cy.contains('20').click();
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('[class="react-datepicker-wrapper"]').last().click()
        cy.wait(1000)

        cy.contains('28').click();
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('#search').click()
        cy.wait(1000)
        // cy.get('#logoutButton').click()
    
      })
  
    // it('.searchbydate() - visit home', () => {
    //     cy.visit('http://localhost:3000')

    //     cy.get('#loginButton').last().click()

    //     // cy.get('#username').click().type('jhaeju20@gmail.com')
    //     // cy.get('#password').click().type('testuser123!')
    //     // cy.get('button').first().click()
    //     cy.get('a[href*="explore"]').first().click()
    //     cy.get('#simple-tab-2').click(); 
    //     cy.get('[class="react-datepicker-wrapper"]').first().click()
    //     cy.wait(1000)
    //     cy.contains('7').click();
    //     cy.wait(1000)

    //     cy.get('body').click(0,0);
    //     cy.get('[class="react-datepicker-wrapper"]').last().click()
    //     cy.wait(1000)

    //     cy.get('[class="react-datepicker__day react-datepicker__day--011"]').click()
    //     cy.wait(1000)

    //     cy.get('body').click(0,0);
    //     cy.get('#search').click()

    //     cy.wait(2000)

    //     cy.get('a[href*="explore"]').first().click()
    //     cy.get('#simple-tab-2').click(); 
    //     cy.get('[class="react-datepicker-wrapper"]').first().click()
    //     cy.wait(1000)
    //     cy.contains('20').click();
    //     cy.wait(1000)

    //     cy.get('body').click(0,0);
    //     cy.get('[class="react-datepicker-wrapper"]').last().click()
    //     cy.wait(1000)

    //     cy.contains('28').click();
    //     cy.wait(1000)

    //     cy.get('body').click(0,0);
    //     cy.get('#search').click()
    //     cy.wait(1000)


    //     // cy.get('#logoutButton').click()
    
    // })
      
  
    })
    