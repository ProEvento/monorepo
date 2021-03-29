context('Logging in', () => {
    it('should login', () => {
      cy.login().then(() => {
  
        // Now run your test...
        cy.request('/api/me').then(({ body: user }) => {
          expect(user.email).to.equal(Cypress.env('auth0Username'));
        });
      });
    });
  });