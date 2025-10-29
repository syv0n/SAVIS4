describe('TMHT Homework Feature - UI Flow', () => {
  beforeEach(() => {

    cy.visit('http://localhost:4200/problems-tmht'); 
    cy.viewport(1920, 1080);

    cy.get('.static-footer').should('be.visible');
  });

  it('should show answer when a user answer is submitted', () => {
    // 1. Find the first input box on the page
    cy.get('.textResp').first().as('firstInput');

    // 2. Type a random answer
    cy.get('@firstInput').type('123');

    // 3. Click Submit
    cy.get('.submit-button').click();

    // 4. Verify that an answer box (correct or incorrect) appears
    cy.get('.answer-box').should('be.visible');
  });

  it('"Hide Answer" button should hide answer and reset inputs', () => {
    // 1. Submit an answer to show the answer
    cy.get('.submit-button').click();

    // 2. Verify answer is visible
    cy.get('.answer-box').should('be.visible');

    // 3. Click "Hide Answer"
    cy.get('.hide-button').click();

    // 4. Verify answer is hidden
    cy.get('.answer-box').should('not.exist');

    // 5. Verify the submit button is back
    cy.get('.submit-button').should('be.visible');
  });

  it('"New Problem" button should clear inputs', () => {
    // 1. Type in the first input
    cy.get('.textResp').first().type('123');

    // 2. Click "New Problem"
    cy.get('.qchange-button').click();

    // 3. Wait for the new problem to load
    cy.wait(500);

    // 4. Verify the input is now empty
    cy.get('body').find('.textResp').first().should('have.value', '');
  });
});