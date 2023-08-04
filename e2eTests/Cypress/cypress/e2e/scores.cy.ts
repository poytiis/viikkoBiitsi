describe('Scores: ', () => {

  beforeEach(function () {
    cy.task('db:seedScores')
    cy.visit('/')
    cy.logIn()
  })
  
  it('show scores', () => {
    cy.get('.results').should('exist')

    cy.fixture('scores').then( data => {

      for (let i = 0; i < 4; i++) {
        cy.get('.table__row-column--' + data.scores[i].player.replace(/\s/g, '')).should('exist')
        cy.get('.table__row-column--' + data.scores[i].serie).should('exist')
        cy.get('.table__row-column--' + data.scores[i].score.toString()).should('exist')
        cy.get('.table__row-column--' + data.scores[i].pool.toString()).should('exist')
      }

      cy.get('.table__paginator-icon--next').click()

      for (let i = 4; i < 8; i++) {
        cy.get('.table__row-column--' + data.scores[i].player.replace(/\s/g, '')).should('exist')
        cy.get('.table__row-column--' + data.scores[i].serie).should('exist')
        cy.get('.table__row-column--' + data.scores[i].score.toString()).should('exist')
        cy.get('.table__row-column--' + data.scores[i].pool.toString()).should('exist')
      }
    })
  })

  it('delete pool', () => {
    cy.fixture('scores').then( data => {
      cy.get('.table__page-number').should('have.text', '1/2')
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).should('exist')
      cy.get('.results__delete-button').click()
      cy.get('.info-dialog__accept-button').click()
      cy.get('.table__page-number').should('have.text', '1/1')
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).should('not.exist')
      cy.get('.table__row-column--' + data.scores[5].player.replace(/\s/g, '')).should('exist')

      cy.get('.results__delete-button').click()
      cy.get('.info-dialog__accept-button').click()
      cy.get('.table__page-number').should('have.text', '1/0')
      cy.get('.table__row-column--' + data.scores[5].player.replace(/\s/g, '')).should('not.exist')    
    })
  })

  it('modify scores', () => {
    cy.fixture('scores').then( data => {
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click()
      cy.get('#modify-dialog__pool-input').clear()
      cy.get('#modify-dialog__pool-input').type(data.updatePlayer.pool)

      cy.get('#modify-dialog__serie-input').clear()
      cy.get('#modify-dialog__serie-input').type(data.updatePlayer.serie)

      cy.get('#modify-dialog__name-input').clear()
      cy.get('#modify-dialog__name-input').type(data.updatePlayer.player)

      cy.get('#modify-dialog__score-input').clear()
      cy.get('#modify-dialog__score-input').type(data.updatePlayer.score)

      cy.get('.modify-dialog__update-button').click()

      cy.get('.table__row-column--' + data.updatePlayer.pool.toString()).should('exist')
      cy.get('.table__row-column--' + data.updatePlayer.serie).should('exist')
      cy.get('.table__row-column--' + data.updatePlayer.player.replace(/\s/g, '')).should('exist')
      cy.get('.table__row-column--' + data.updatePlayer.score.toString()).should('exist')
    })

  })

  it('show table error message', () => {
    cy.fixture('scores').then( data => {
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click()
      cy.get('#modify-dialog__score-input').clear()
      cy.get('#modify-dialog__score-input').type(data.updatePlayer.score)
      cy.get('.modify-dialog__update-button').click()

      cy.get('.table__paginator-error').should('have.text', 'Lohkon pisteet laskettu väärin: 99')

      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click()
      cy.get('#modify-dialog__score-input').clear()
      cy.get('#modify-dialog__score-input').type('xxxxx')
      cy.get('.modify-dialog__update-button').click()

      cy.get('.table__paginator-error').should('have.text', 'Lohkossa virheellisiä pisteitä!')
    })
  })

  it('update scores', () => {
    cy.get('.results__update-scores-button').click()
    cy.get('.info-dialog__text--men-pools').should('have.text', 'Miesten lohkoja: 1')
    cy.get('.info-dialog__text--women-pools').should('have.text', 'Naisten lohkoja: 1')

    cy.get('.info-dialog__accept-button').click()

    cy.get('.table__page-number').should('have.text', '1/0')
  })
})