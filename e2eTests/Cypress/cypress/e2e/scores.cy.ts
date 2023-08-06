import { Scores } from "../../types"

describe('Scores: ', () => {

  beforeEach(() => {
    cy.task('db:seedScores')
    cy.visit('/')
    cy.logIn()
  })
  
  it('show scores', () => {
    cy.get('.results').should('exist')

    cy.fixture('scores').then( (data: Scores) => {

      for (let i = 0; i < 4; i++) {
        cy.validateTable(data.scores[i])
      }

      cy.get('.table__paginator-icon--next').click()

      for (let i = 4; i < 8; i++) {
        cy.validateTable(data.scores[i])
      }
    })
  })

  it('delete pool', () => {
    cy.fixture('scores').then( (data: Scores) => {
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
    cy.fixture('scores').then( (data: Scores) => {
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click()
      cy.get('#modify-dialog__pool-input').clear()
      cy.get('#modify-dialog__pool-input').type(data.updatePlayer.pool.toString())

      cy.get('#select-modify-dialog__serie-select').click()
      cy.get('#select-input-option-' + data.updatePlayer.serie).click()

      cy.get('#modify-dialog__name-input').clear()
      cy.get('#modify-dialog__name-input').type(data.updatePlayer.player)

      cy.get('#modify-dialog__score-input').clear()
      cy.get('#modify-dialog__score-input').type(data.updatePlayer.plusMinusPoints.toString())

      cy.get('.modify-dialog__update-button').click()

      cy.validateTable(data.updatePlayer)
    })

  })

  it('show table error message', () => {
    cy.fixture('scores').then( (data: Scores) => {
      cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click()
      cy.get('#modify-dialog__score-input').clear()
      cy.get('#modify-dialog__score-input').type(data.updatePlayer.plusMinusPoints.toString())
      cy.get('.modify-dialog__update-button').click()

      cy.get('.table__paginator-error').should('have.text', 'Lohkon pisteet laskettu väärin: 99')
    })
  })

  it('update scores', () => {
    cy.get('.results__update-scores-button').click()
    cy.get('.info-dialog__text--men-pools').should('have.text', 'Miesten lohkoja: 1')
    cy.get('.info-dialog__text--women-pools').should('have.text', 'Naisten lohkoja: 1')

    cy.get('.info-dialog__accept-button').click()

    cy.get('.table__page-number').should('have.text', '1/0')
  })

  it('input validation', () => {
    cy.fixture('scores').then( (data: Scores) => {
      data.invalidUpdatePlayers.forEach(validation => {
        cy.get('.table__row-column--' + data.scores[0].player.replace(/\s/g, '')).click();

        cy.validateInput('#modify-dialog__pool-input', validation.input.pool, validation.errorMessage.pool, true)
        cy.validateInput('#modify-dialog__name-input', validation.input.player, validation.errorMessage.player, true)
        cy.validateInput('#modify-dialog__score-input', validation.input.plusMinusPoints, validation.errorMessage.plusMinusPoints, true)

        cy.get('.modify-dialog__close-button').click()
      });     
    })
  })
})