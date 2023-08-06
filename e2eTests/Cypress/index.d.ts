/// <reference types="cypress" />

import { OldResult, SearchOldResult, WeekResult } from "./types";

export {}
declare global {
  namespace Cypress {
    interface Chainable {
      logIn(): Chainable<void>;
      validateInput(id: string, inputText: string | number, errorMessage: string, clear?: boolean): Chainable<void>;
      searchOldResult(result: SearchOldResult, clear?: boolean): Chainable<void>;
      clearOldResultInputs(): Chainable<void>;
      validateTable(data: any): Chainable<void>;
    }
  }
}