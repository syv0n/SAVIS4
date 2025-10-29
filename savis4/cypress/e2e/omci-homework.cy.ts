describe('OMCI Homework Feature - UI Flow', () => {
  beforeEach(() => {
    
    cy.visit('http://localhost:4200/problems-omci'); 
    cy.viewport(1920, 1080);

    cy.get('.static-footer').should('be.visible');
  });

  it('should show feedback when an answer is submitted', () => {
    // 1. Find the first input box on the page
    cy.get('.textbox').first().as('firstInput');

    // 2. Type a random answer
    cy.get('@firstInput').type('123');

    // 3. Click Submit
    cy.get('.submit-button').click();

    // 4. Verify that *a* feedback box (correct or incorrect) appears
    cy.get('.feedback-box').should('be.visible');
    
    // 5. Verify the submit button is gone
    cy.get('.submit-button').should('not.exist');
  });

  it('"Hide Answer" button should hide feedback and reset inputs', () => {
    // 1. Submit an answer to show the feedback
    cy.get('.textbox').first().type('123');
    cy.get('.submit-button').click();

    // 2. Verify feedback is visible
    cy.get('.feedback-box').should('be.visible');

    // 3. Click "Hide Answer"
    cy.get('.try-again-button').click();

    // 4. Verify feedback is hidden
    cy.get('.feedback-box').should('not.exist');

    // 5. Verify the submit button is back
    cy.get('.submit-button').should('be.visible');

    // 6. Verify the input box was cleared
    cy.get('.textbox').first().should('have.value', '');
  });

  it('"New Problem" button should clear inputs', () => {
    // 1. Type in the first input
    cy.get('.textbox').first().type('123');

    // 2. Click "New Problem"
    cy.get('.generate-button').click();

    // 3. Wait for the new problem to load
    cy.wait(500);

    // 4. Verify the input is now empty
    cy.get('body').find('.textbox').first().should('have.value', '');
  });
});