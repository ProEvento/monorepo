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
      cy.get('#logoutButton').last().click()

      // Grab username to invite
      let inviteUser = 'testuser' + random;
      random = Math.round(Math.random()* 1000000)

      // Sign up with second user
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


      // Create event
      cy.wait(5000)
      cy.get('a[href*="events"]').first().click()
      cy.get('#newEvent').first().click()
      cy.get('#title').click().type('MyCoolEventForTestingPurposes')
      cy.get('#description').click().type('We will see this desription displayed')
      cy.get('#picture').click().type('https://www.legacy.com/wp-content/uploads/2020/01/Sympathy-flowers-orange-1000-shutterstock_694680475.jpg')
      cy.get('[class="form-control"]').click()
      cy.get('[class="rdtPicker"]').click('center')
      cy.get('body').click(0,0);
      cy.get('#save').click()
      cy.location('pathname').should('include', 'event')
      

      let hostUser = 'testuser' + random;
      // Invite first user
      cy.get('input[type*="text"]').type(inviteUser)
      cy.get('#sendinvite').click()
      cy.get('#logoutButton').last().click()
      
      // Login with second user to find invitation and register
      cy.visit('http://localhost:3000')
      cy.get('#loginButton').last().click()
      cy.get('#username').click().type(inviteUser + "@gmail.com")
      cy.get('#password').click().type('testuser123!')
      cy.get('button[type*="submit"]').first().click()

      cy.visit('http://localhost:3000/events')
      cy.get('button[aria-haspopup*="true"]').first().click()
      cy.get('#notificationText').first().contains('by ' + hostUser)

      cy.get('#logoutButton').last().click()
      // Grab text and grab link to visit

    })
  })