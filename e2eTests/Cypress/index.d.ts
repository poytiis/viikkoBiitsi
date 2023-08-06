/// <reference types="cypress" />

export {}
declare global {
  namespace Cypress {
    interface Chainable {
      logIn(): Chainable<void>;
      validateInput(id: string, inputText: string, errorMessage: string, clear?: boolean): Chainable<void>;
    }
  }
}