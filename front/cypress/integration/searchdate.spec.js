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
        let mon = makeRandomInt(12)
        var genArr = Array.from({length:mon},(v,k)=>k+1)
        cy.wrap(genArr).each((index) => {
            cy.get('[class="rdtNext"]').click()
        })
       
        cy.get('[class="rdtNext"]').click()

        let day = makeRandomInt(30); 
        cy.get('[class="rdtDay"]').contains(day).click();
        cy.get('body').click(0,0);
        cy.get('#save').click()


        //search

        cy.get('a[href*="explore"]').first().click()
        cy.get('#simple-tab-2').click(); 
        cy.get('[class="react-datepicker-wrapper"]').first().click()
        var genArr = Array.from({length:mon+1},(v,k)=>k+1)
        cy.wrap(genArr).each((index) => {
            cy.get('[class="react-datepicker__navigation react-datepicker__navigation--next"]').click()
        })
        cy.wait(1000)
        cy.contains(day).click();
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('[class="react-datepicker-wrapper"]').last().click()
        cy.wait(1000)
        var genArr = Array.from({length:mon+2},(v,k)=>k+1)
        cy.wrap(genArr).each((index) => {
            cy.get('[class="react-datepicker__navigation react-datepicker__navigation--next"]').click()
        })
        cy.contains(day).click()
        cy.wait(1000)

        cy.get('body').click(0,0);
        cy.get('#search').click()

        cy.wait(2000)
    
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
    