/// <reference types="cypress" />

export {}
declare global {
  namespace Cypress {
    interface Chainable {
      logIn(): Chainable<void>;
    }
  }
}