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
      it('.searchByEventName() - search event name', () => {
        cy.visit('http://localhost:3000')
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
        cy.get('[class="form-control"]').click()
        cy.contains('24').click();
        cy.get('body').click(0,0);
        cy.get('#save').click()
        cy.get('a[href*="events"]').first().click()
        cy.get('#newEvent').first().click()
        let random_string2 = "Hangout_" + makeid(5);
        cy.get('#title').click().type(random_string2)
        cy.get('#description').click().type('We will see this desription displayed')
        cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
        cy.get('[class="form-control"]').click()
        cy.contains('20').click();
        cy.get('body').click(0,0);
        cy.get('#save').click()
        cy.get('a[href*="events"]').first().click()
        cy.get('#newEvent').first().click()
        let random_string3 = "Gamenight_" + makeid(5);
        cy.get('#title').click().type(random_string3)
        cy.get('#description').click().type('We will see this desription displayed')
        cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
        cy.get('[class="form-control"]').click()
        cy.contains('7').click();
        cy.get('body').click(0,0);
        cy.get('#save').click()
        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-0').click(); 
        cy.get('#outlined-basic').click().type(random_string1) // expecting to find one event (care's party)
        cy.get('#search').click()
        cy.get('li:first').should('have.class', 'MuiListItem-root') // event's listed have this class 
        cy.get('a[href*="explore"]').first().click()
  
        cy.get('#outlined-basic').click().type(random_string2) // expecting to find one event (care's party)
        cy.get('#search').click()
        cy.get('li:first').should('have.class', 'MuiListItem-root')
        cy.get('a[href*="explore"]').first().click()
  
        cy.get('#outlined-basic').click().type(random_string3) // expecting to find one event (care's party)
        cy.get('#search').click()
        cy.get('li:first').should('have.class', 'MuiListItem-root')
        cy.wait(1500)

        cy.get('#logoutButton').click()

      })
  
    })
    