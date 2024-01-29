describe('Settings: ', () => {
  beforeEach(() => {
    cy.task('db:seedOldScores');
    cy.visit('/');
    cy.logIn();
  })

  it('change scores count', () => {
    cy.get('.header__tab--settings').click();
    cy.get('.settings__counting-score-radio-1 > span').should('have.class', 'Mui-checked');
    cy.get('.settings__counting-score-radio-2').click();
    cy.get('.settings__counting-score-radio-2 > span').should('have.class', 'Mui-checked');
    cy.reload();
    cy.get('.settings__counting-score-radio-2 > span').should('have.class', 'Mui-checked');
    cy.get('.settings__counting-score-radio-1').click();
    cy.reload();
    cy.get('.settings__counting-score-radio-1 > span').should('have.class', 'Mui-checked');
  });

  it('calculate beging ranking', () => {  
    cy.task('db:moveOldScoresOneYearBack');
    cy.wait(1000);
    cy.get('.header__tab--settings').click();
    cy.get('.settings__calculate-beging-ranking-button').click();
    cy.get('.snackbar__message').should('have.text', 'Alkurankingit laskettu onnistuneesti');
  });

  it('calculate invalid beging ranking', () => {
    cy.task('db:moveOldScoresToThisYear');
    cy.wait(1000);
    cy.get('.header__tab--settings').click();
    cy.get('.settings__calculate-beging-ranking-button').click();
    cy.get('.snackbar__message').should('have.text', 'Alkurankingien laskeminen epäonnistui');
  })

});