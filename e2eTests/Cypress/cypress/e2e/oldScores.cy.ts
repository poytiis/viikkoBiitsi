import { OldScores } from '../../types'

describe('Old scores: ', () => {

  beforeEach(() => {
    cy.viewport(1500, 1500) 
    cy.task('db:seedOldScores')
    cy.visit('/')
    cy.logIn()
  })
  
  it('search queries', () => {
    cy.fixture('oldScores').then( (data: OldScores) => {
      cy.get('.header__tab--old-scores').click()

      data.searchParams.forEach(search => {

        cy.searchOldResult(search);

        let resultIndex = 0;
        search.results.forEach(result => {
          if(resultIndex % 6 === 0) {
            cy.get('.table__paginator-icon--next').click()
          }
          resultIndex++;

          cy.validateTable(result)           
        })

        cy.clearOldResultInputs();  
      });
    })
  
  });

  it('modify scores', () => {
    cy.fixture('oldScores').then( (data: OldScores) => {
      cy.get('.header__tab--old-scores').click()

      data.modifyParams.forEach(modify => {

        cy.searchOldResult(modify.searchParams);


        cy.get('.table__row-column--' + modify.searchParams.player.replace(/\s/g, '')).click()

        cy.get('#modify-dialog__pool-input').clear()
        cy.get('#modify-dialog__pool-input').type(modify.modifyParams.pool.toString())
  
        cy.get('#select-modify-dialog__serie-select').click()
        cy.get('#select-input-option-' + modify.modifyParams.serie).click()
  
        cy.get('#modify-dialog__name-input').clear()
        cy.get('#modify-dialog__name-input').type(modify.modifyParams.player)
  
        cy.get('#modify-dialog__score-input').clear()
        cy.get('#modify-dialog__score-input').type(modify.modifyParams.seriePoints.toString())

        cy.get('#modify-dialog__plus-minus-input').clear()
        cy.get('#modify-dialog__plus-minus-input').type(modify.modifyParams.plusMinusPoints.toString())

        cy.get('#modify-dialog__ranking-input').clear()
        cy.get('#modify-dialog__ranking-input').type(modify.modifyParams.ranking.toString())

        cy.get('#modify-dialog__year-input').clear()
        cy.get('#modify-dialog__year-input').type(modify.modifyParams.year.toString())

        cy.get('#modify-dialog__week-input').clear()
        cy.get('#modify-dialog__week-input').type(modify.modifyParams.week.toString())

        cy.get('.modify-dialog__update-button').click()

        cy.searchOldResult(modify.modifyParams, true);

        cy.validateTable(modify.modifyParams)      
      });   
    })
  });

  it('input validation', () => {
    cy.get('.header__tab--old-scores').click()
    cy.fixture('oldScores').then( (data: OldScores)  => {
      data.searchInputValidation.forEach((validation) => {
        cy.validateInput('#old-results__player-input', validation.input.player, validation.errorMessage.player, true)
        cy.validateInput('#old-results__year-input', validation.input.year, validation.errorMessage.year, true)
        cy.validateInput('#old-results__week-input', validation.input.week, validation.errorMessage.week, true)
        cy.validateInput('#old-results__pool-input', validation.input.pool, validation.errorMessage.pool, true)
      });

      const searchParam = data.modifyParams[0].searchParams

      cy.searchOldResult(searchParam);

      data.modifyInputValidation.forEach(validation => {
        cy.get('.table__row-column--' + searchParam.player.replace(/\s/g, '')).click()

        cy.validateInput('#modify-dialog__name-input', validation.input.player, validation.errorMessage.player, true)
        cy.validateInput('#modify-dialog__year-input', validation.input.year, validation.errorMessage.year, true)
        cy.validateInput('#modify-dialog__week-input', validation.input.week, validation.errorMessage.week, true)
        cy.validateInput('#modify-dialog__pool-input', validation.input.pool, validation.errorMessage.pool, true)
        cy.validateInput('#modify-dialog__ranking-input', validation.input.pool, validation.errorMessage.pool, true)
        cy.validateInput('#modify-dialog__plus-minus-input', validation.input.plusMinusPoints, validation.errorMessage.plusMinusPoints, true)
        cy.validateInput('#modify-dialog__score-input', validation.input.seriePoints, validation.errorMessage.seriePoints, true)

        cy.get('.modify-dialog__close-button').click()
      });
    });
  });

  it('delete score', () => {
    cy.get('.header__tab--old-scores').click()
    cy.fixture('oldScores').then( (data: OldScores)  => {
      cy.searchOldResult(data.modifyParams[0].searchParams);
      cy.get('.table__row-column--' + data.modifyParams[0].searchParams.player.replace(/\s/g, '')).click()
      cy.get('.modify-dialog__delete-score-button').click()
     
      cy.get('.info-dialog__close-button').click()
      cy.get('.modify-dialog__close-button').click()
      cy.get('.table__row-column--' + data.modifyParams[0].searchParams.player.replace(/\s/g, '')).should('exist')

      cy.get('.table__row-column--' + data.modifyParams[0].searchParams.player.replace(/\s/g, '')).click()
      cy.get('.modify-dialog__delete-score-button').click()
      cy.get('.info-dialog__accept-button').click()
      cy.get('.old-results__search-button').click()
      cy.get('.table__row-column--' + data.modifyParams[0].searchParams.player.replace(/\s/g, '')).should('not.exist')
    })
  });
})