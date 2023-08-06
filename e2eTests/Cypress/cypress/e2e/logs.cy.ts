describe('Logs: ', () => {

  beforeEach(() => {
    cy.task('db:seedLogs')
    cy.visit('/')
    cy.logIn()
  })

  it('show logs', () => {
    cy.fixture('logs').then( data => {
      cy.get('.header__tab--logs').click()

      for (let i = 0; i < 6; i++) {
        cy.get('.table__row-column--' + data.logs[i].timeStamp).should('exist')
      }
    })

  });

})