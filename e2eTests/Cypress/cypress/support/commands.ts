import { OldResult, SearchOldResult, WeekResult } from '../../types';

const clearOldResultInputs = () => {
  cy.get('#old-results__player-input').clear()
  cy.get('#old-results__year-input').clear()
  cy.get('#old-results__week-input').clear()
  cy.get('#select-old-results__serie-select').click()
  cy.get('#select-input-option-').click()
  cy.get('#old-results__pool-input').clear()
}

Cypress.Commands.add('logIn', () => {
  cy.task('db:seedLogIn')
  cy.fixture('authentication').then( data => {     
    cy.get('#log-in__username').type(data.validUser.username)
    cy.get('#log-in__password').type(data.validUser.password)
    cy.get('.log-in__button').click()
  })
})

Cypress.Commands.add('validateInput', (id: string, inputText: string | number, errorMessage: string, clear: boolean = false) => {
  const inputTextSTR = inputText.toString();
  if(clear) {
    cy.get(id).clear();
  }
  if(inputTextSTR) {
    cy.get(id).type(inputTextSTR)
  } else {
    cy.get(id).focus()
  }
  cy.get(id).blur()
  if(errorMessage) {
    cy.get( id + '-helper-text').should('have.text', errorMessage)
  } else {
    cy.get(id  + '-helper-text').should('not.exist')
  }
});

Cypress.Commands.add('clearOldResultInputs', () => {
  clearOldResultInputs();
});

Cypress.Commands.add('searchOldResult', (result: SearchOldResult, clear: boolean = false) => {
  if(clear) {
    clearOldResultInputs();
  }
  if (result.player !== null) {
    cy.get('#old-results__player-input').type(result.player)
  }

  if (result.year !== null) {
    cy.get('#old-results__year-input').type(result.year.toString())
  }

  if (result.week !== null) {
    cy.get('#old-results__week-input').type(result.week.toString())
  }

  if (result.serie !== null) {
    cy.get('#select-old-results__serie-select').click()
    cy.get('#select-input-option-' + result.serie).click()
  }

  if (result.pool !== null) {
    cy.get('#old-results__pool-input').type(result.pool.toString())
  }

  cy.get('.old-results__search-button').click()
});

Cypress.Commands.add('validateTable', (data: any) => {
  cy.get('.table__row-column--' + data.player.replace(/\s/g, '')).should('exist')
  if(data.year) {
    cy.get('.table__row-column--' + data.year.toString()).should('exist')
  }
  cy.get('.table__row-column--' + data.serie).should('exist')
  cy.get('.table__row-column--' + data.pool.toString()).should('exist')
  if (data.week) {
    cy.get('.table__row-column--' + data.week.toString()).should('exist')
  }
  if (data.plusMinusPoints) {
    cy.get('.table__row-column--' + data.plusMinusPoints.toString()).should('exist')
  }
  if (data.ranking) {
    cy.get('.table__row-column--' + data.ranking.toString()).should('exist')
  }

  if (data.seriePoints) {
    cy.get('.table__row-column--' + data.seriePoints.toString()).should('exist')
  } 
});
