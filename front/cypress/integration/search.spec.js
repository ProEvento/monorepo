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
    //   cy.get('#rdt').select('')
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
    //   cy.get('#rdt').select('')
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
    //   cy.get('#rdt').select('')
      cy.get('[class="form-control"]').click()
      cy.contains('7').click();
      cy.get('body').click(0,0);
      cy.get('#save').click()
    //   cy.get('#logoutButton').click()
      cy.get('a[href*="explore"]').first().click()
      cy.get('#simple-tab-0').click(); 
      cy.get('#outlined-basic').click().type(random_string1) // expecting to find one event (care's party)
      cy.get('#search').click()
      cy.wait(2000)
      cy.get('li:first').should('have.class', 'MuiListItem-root') // event's listed have this class 
      cy.get('a[href*="explore"]').first().click()

      cy.get('#outlined-basic').click().type(random_string2) // expecting to find one event (care's party)
      cy.get('#search').click()
      cy.wait(2000)
      cy.get('li:first').should('have.class', 'MuiListItem-root')
      cy.get('a[href*="explore"]').first().click()

      cy.get('#outlined-basic').click().type(random_string3) // expecting to find one event (care's party)
      cy.get('#search').click()
      cy.wait(2000)
      cy.get('li:first').should('have.class', 'MuiListItem-root')
  
    })

    it('.searchbyuser() -search users', () => {
        cy.visit('http://localhost:3000')
  
        cy.get('#loginButton').last().click()
  
        // cy.get('#username').click().type('jhaeju20@gmail.com')
        // cy.get('#password').click().type('testuser123!')
        // cy.get('button.c8b93fbb9').click()
        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-1').click(); 
        cy.get('#outlined-basic').click().type('carolynhuaaa')
        cy.get('#search').click()
        cy.get('a[href*="user/carolynhuaaa"]').first().click()
        cy.wait(1500)

        cy.location('pathname').should('include', 'carolynhuaaa')

        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-1').click(); 
        cy.get('#outlined-basic').click().type('haeju')
        cy.get('#search').click()
        cy.get('a[href*="user/haeju"]').first().click()
        cy.wait(1500)
        cy.location('pathname').should('include', 'haeju')

        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-1').click(); 
        cy.get('#outlined-basic').click().type('elissaperdue')
        cy.get('#search').click()
        cy.get('a[href*="user/elissaperdue"]').first().click()
        cy.wait(1500)

        cy.location('pathname').should('include', 'elissaperdue')

        cy.wait(1500)
    
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
        cy.contains('7').click();
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('[class="react-datepicker-wrapper"]').last().click()
        cy.wait(1000)

        cy.get('[class="react-datepicker__day react-datepicker__day--011"]').click()
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('#search').click()
  
        cy.wait(2000)

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


        cy.get('#logoutButton').click()
    
      })
    

  })
  