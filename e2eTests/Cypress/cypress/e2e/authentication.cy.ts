describe('Authentication: ', () => {

  beforeEach(() => {
    cy.task('db:seed')
    cy.visit('/')
  })

  it('valid login', () => {
    cy.fixture('authentication').then( data => {     
      cy.get('#log-in__username').type(data.validUser.username)
      cy.get('#log-in__password').type(data.validUser.password)
      cy.get('.log-in__button').click()
  
      cy.url().should('include', '/viikon-tulokset')
      cy.get('.results').should('exist')
      cy.get('.log-in__button').should('not.exist')
    })
  })

  it('invalid login', () => {
    cy.fixture('authentication').then( data => {
      data.invalidUsers.forEach( user => {
        cy.get('#log-in__username').type(user.username)
        cy.get('#log-in__password').type(user.password)
        cy.get('.log-in__button').click()
    
        cy.url().should('not.include', '/viikon-tulokset')
        cy.get('.results').should('not.exist')
        cy.get('.log-in__button').should('exist')

        cy.get('#log-in__username').clear()
        cy.get('#log-in__password').clear()       
      });
    })
  })

  it('redirect to login', () => {
    cy.visit('/viikon-tulokset')
    cy.get('.results').should('not.exist')
    cy.get('.log-in__button').should('exist')
  })
})