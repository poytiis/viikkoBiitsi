Cypress.Commands.add('logIn', () => {
  cy.fixture('authentication').then( data => {     
    cy.get('#log-in__username').type(data.validUser.username)
    cy.get('#log-in__password').type(data.validUser.password)
    cy.get('.log-in__button').click()
  })
})