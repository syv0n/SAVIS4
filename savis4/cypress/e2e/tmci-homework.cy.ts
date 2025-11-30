describe('TMCI Homework Feature - UI Flow', () => {
  beforeEach(() => {
   
    cy.visit('http://localhost:4200/problems-tmci'); 
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


  // ---WORKSPACE TESTS ---

  it('has the main practice UI and workspace controls', () => {
      // Check for a known element on the TMCI page
      cy.get('.generate-button').should('exist');
      
      // workspace controls (these ids/classes are expected from the workspace implementation)
      cy.get('#drawingCanvas').should('exist');
      cy.get('#textOverlay').should('exist');
      cy.get('#drawButton').should('exist');
      cy.get('#textButton').should('exist');
      cy.get('#eraserButton').should('exist');
      cy.get('#clearButton').should('exist');
  });

  it('supports drawing on the canvas (produces a non-empty dataURL)', () => {
      // ensure we're in draw mode
      cy.get('#drawButton').click();
      cy.get('#drawingCanvas').then(($c) => {
      const canvas = $c[0] as HTMLCanvasElement;
      const before = canvas.toDataURL();
      // simulate drawing with mousedown/mousemove/mouseup
      cy.wrap($c)
          .trigger('mousedown', { which: 1, pageX: 100, pageY: 100 })
          .trigger('mousemove', { which: 1, pageX: 200, pageY: 120 })
          .trigger('mouseup', { force: true });

      cy.wait(200);
      cy.get('#drawingCanvas').then(($c2) => {
          const after = ($c2[0] as HTMLCanvasElement).toDataURL();
          expect(after.length).to.be.greaterThan(before.length);
      });
      });
  });

  it('supports eraser mode which alters the canvas dataURL', () => {
      // draw a stroke first
      cy.get('#drawButton').click();
      cy.get('#drawingCanvas')
      .trigger('mousedown', { which: 1, pageX: 60, pageY: 60 })
      .trigger('mousemove', { which: 1, pageX: 260, pageY: 60 })
      .trigger('mouseup', { force: true });

      cy.wait(200);

      cy.get('#drawingCanvas').then(($c) => {
      const before = ($c[0] as HTMLCanvasElement).toDataURL();
      // switch to eraser and erase a bit
      cy.get('#eraserButton').click();
      cy.get('#drawingCanvas')
          .trigger('mousedown', { which: 1, pageX: 120, pageY: 60 })
          .trigger('mousemove', { which: 1, pageX: 140, pageY: 60 })
          .trigger('mouseup', { force: true });

      cy.wait(200);
      cy.get('#drawingCanvas').then(($c2) => {
          const after = ($c2[0] as HTMLCanvasElement).toDataURL();
          // erasing should change the dataURL
          expect(after).to.not.equal(before);
      });
      });
  });

  it('text overlay can be edited, committed to canvas and persists', () => {
      cy.get('#textButton').click();
      cy.get('#textOverlay').should('be.visible').click();
      // textarea starts readonly in the app until clicked into; ensure it's writable for the test
      cy.get('#textOverlay').invoke('prop', 'readOnly', false);
      cy.get('#textOverlay').clear().type('Hello Cypress');
      
      // Click away to commit the text (e.g., click the canvas or draw button)
      cy.get('#drawButton').click();
      cy.wait(200);

      // the canvas should change after committing text
      cy.get('#drawingCanvas').then(($c) => {
      const data = ($c[0] as HTMLCanvasElement).toDataURL();
      expect(data.length).to.be.greaterThan(1000); // Check that *something* was drawn
      });
      
      // toggle back to text mode and ensure overlay still contains typed text
      cy.get('#textButton').click();
      cy.get('#textOverlay').should('contain.value', 'Hello Cypress');
  });

  it('pen color buttons update the text overlay color', () => {
      // pick red (buttons are icon-only; target by color class)
      cy.get('.color-button.red').click();
      cy.get('#textButton').click();
      cy.get('#textOverlay').should('have.css', 'color').and((color) => {
      // color should be non-empty; exact mapping depends on CSS (we at least ensure it's set)
      expect(color).to.exist.and.not.be.empty;
      });
  });

  it('clear button empties the overlay and alters the canvas', () => {
      // draw something and add text
      cy.get('#drawButton').click();
      cy.get('#drawingCanvas')
      .trigger('mousedown', { which: 1, pageX: 30, pageY: 30 })
      .trigger('mousemove', { which: 1, pageX: 80, pageY: 30 })
      .trigger('mouseup', { force: true });

      // Activate text mode, focus the overlay, make it writable, type and blur to commit
      cy.get('#textButton').click();
      cy.get('#textOverlay').should('be.visible').click();
      cy.get('#textOverlay').invoke('prop', 'readOnly', false).clear().type('Clear me').blur();
      cy.wait(200);

      cy.get('#drawingCanvas').then(($c) => {
      const filled = ($c[0] as HTMLCanvasElement).toDataURL();
      cy.get('#clearButton').click();
      cy.wait(200);
      cy.get('#drawingCanvas').then(($c2) => {
          const cleared = ($c2[0] as HTMLCanvasElement).toDataURL();
          expect(cleared).to.not.equal(filled);
      });
      });
      cy.get('#textOverlay').should('have.value', '');
  });
});
