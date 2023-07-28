describe('Scores: ', () => {

  beforeEach(function () {
    cy.task('db:seedScores')
    cy.visit('/')
    cy.logIn()
  })
  
  it('show scores', () => {
    cy.get('.results').should('exist')
  })
})