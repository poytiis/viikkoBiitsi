describe('Old scores: ', () => {

  beforeEach(function () {
    cy.viewport(1500, 1500) 
    cy.task('db:seedOldScores')
    cy.visit('/')
    cy.logIn()
  })
  
  it('search queries', () => {
    cy.fixture('oldScores').then( data => {
      cy.get('.header__tab--old-scores').click()

      data.searchParams.forEach(search => {
        if (search.player !== null) {
          cy.get('#old-results__player-input').type(search.player)
        }

        if (search.year !== null) {
          cy.get('#old-results__year-input').type(search.year)
        }

        if (search.week !== null) {
          cy.get('#old-results__week-input').type(search.week)
        }

        if (search.serie !== null) {
          cy.get('#old-results__serie-input').type(search.serie)
        }

        if (search.pool !== null) {
          cy.get('#old-results__pool-input').type(search.pool)
        }

        cy.get('.old-results__search-button').click()

        let resultIndex = 0;
        search.results.forEach(result => {
          if(resultIndex % 6 === 0) {
            cy.get('.table__paginator-icon--next').click()
          }
          resultIndex++;

          cy.get('.table__row-column--' + result.player.replace(/\s/g, '')).should('exist')
          cy.get('.table__row-column--' + result.year.toString()).should('exist')
          cy.get('.table__row-column--' + result.week.toString()).should('exist')
          cy.get('.table__row-column--' + result.serie).should('exist')
          cy.get('.table__row-column--' + result.pool.toString()).should('exist')
            
        })

        cy.get('#old-results__player-input').clear()
        cy.get('#old-results__year-input').clear()
        cy.get('#old-results__week-input').clear()
        cy.get('#old-results__serie-input').clear()
        cy.get('#old-results__pool-input').clear()

          
      });
    })
  
  });

  it('modify scores', () => {
    cy.fixture('oldScores').then( data => {
      cy.get('.header__tab--old-scores').click()

      data.modifyParams.forEach(modify => {

        if (modify.searchParams.player !== null) {
          cy.get('#old-results__player-input').type(modify.searchParams.player)
        }

        if (modify.searchParams.year !== null) {
          cy.get('#old-results__year-input').type(modify.searchParams.year)
        }

        if (modify.searchParams.week !== null) {
          cy.get('#old-results__week-input').type(modify.searchParams.week)
        }

        if (modify.searchParams.serie !== null) {
          cy.get('#old-results__serie-input').type(modify.searchParams.serie)
        }

        if (modify.searchParams.pool !== null) {
          cy.get('#old-results__pool-input').type(modify.searchParams.pool)
        }

        cy.get('.old-results__search-button').click()

        cy.get('.table__row-column--' + modify.searchParams.player.replace(/\s/g, '')).click()

        cy.get('#modify-dialog__pool-input').clear()
        cy.get('#modify-dialog__pool-input').type(modify.modifyParams.pool)
  
        cy.get('#modify-dialog__serie-input').clear()
        cy.get('#modify-dialog__serie-input').type(modify.modifyParams.serie)
  
        cy.get('#modify-dialog__name-input').clear()
        cy.get('#modify-dialog__name-input').type(modify.modifyParams.player)
  
        cy.get('#modify-dialog__score-input').clear()
        cy.get('#modify-dialog__score-input').type(modify.modifyParams.score)

        cy.get('#modify-dialog__plus-minus-input').clear()
        cy.get('#modify-dialog__plus-minus-input').type(modify.modifyParams.plusMinusScore)

        cy.get('#modify-dialog__ranking-input').clear()
        cy.get('#modify-dialog__ranking-input').type(modify.modifyParams.ranking)

        cy.get('#modify-dialog__year-input').clear()
        cy.get('#modify-dialog__year-input').type(modify.modifyParams.year)

        cy.get('#modify-dialog__week-input').clear()
        cy.get('#modify-dialog__week-input').type(modify.modifyParams.week)

        cy.get('.modify-dialog__update-button').click()


        cy.get('#old-results__player-input').clear()
        cy.get('#old-results__year-input').clear()
        cy.get('#old-results__week-input').clear()
        cy.get('#old-results__serie-input').clear()
        cy.get('#old-results__pool-input').clear()

        cy.get('#old-results__player-input').type(modify.modifyParams.player)
        cy.get('#old-results__year-input').type(modify.modifyParams.year)
        cy.get('#old-results__week-input').type(modify.modifyParams.week)
        cy.get('#old-results__serie-input').type(modify.modifyParams.serie)
        cy.get('#old-results__pool-input').type(modify.modifyParams.pool)

        cy.get('.old-results__search-button').click()

        cy.get('.table__row-column--' + modify.modifyParams.player.replace(/\s/g, '')).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.year.toString()).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.week.toString()).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.serie).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.pool.toString()).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.plusMinusScore.toString()).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.ranking.toString()).should('exist')
        cy.get('.table__row-column--' + modify.modifyParams.score.toString()).should('exist')
        
      });

      
    })

  });
  
})