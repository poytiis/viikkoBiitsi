Cypress.Commands.add('logIn', () => {
  cy.task('db:seedLogIn')
  cy.fixture('authentication').then( data => {     
    cy.get('#log-in__username').type(data.validUser.username)
    cy.get('#log-in__password').type(data.validUser.password)
    cy.get('.log-in__button').click()
  })
})

Cypress.Commands.add('validateInput', (id: string, inputText: string, errorMessage: string, clear: boolean = false) => {
  if(clear) {
    cy.get(id).clear();
  }
  if(inputText) {
    cy.get(id).type(inputText)
  } else {
    cy.get(id).focus()
  }
  cy.get(id).blur()
  if(errorMessage) {
    cy.get( id + '-helper-text').should('have.text', errorMessage)
  } else {
    cy.get(id  + '-helper-text').should('not.exist')
  }
})