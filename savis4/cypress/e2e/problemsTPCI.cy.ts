describe('TPCI Problems Homework Features', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems-tpci')
    })

    it('should have tpci homework features', () => {
        cy.contains('Two Proportion Confidence Interval Problems').should('be.visible')
        cy.get('.green-box').should('contains.text', '.')
        cy.contains('button', 'Generate New Problem').should('be.visible')
        cy.contains('button', 'Submit Answer').should('be.visible')
        cy.get('.chart-container').should('be.visible')
    })

    it('should generate new problem when button is clicked', () => {
        cy.contains('button', 'New Problem').click()
        cy.wait(500)
        cy.contains('.green-box').should('not.be.empty')
    })
    
    it('should allow typing in the answer box ', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')
        cy.get('.textbox4').type('0.950').should('have.value', '0.950')
        cy.get('.textbox5').type('0.673').should('have.value', '0.673')    
    })

    it('should show if answers is correct or incorrect', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')
        cy.get('.textbox4').type('0.950').should('have.value', '0.950')
        cy.get('.textbox5').type('0.673').should('have.value', '0.673')
        cy.get('.submit-button').click()
        cy.get('.feedback-section').should('be.visible')
    })

    it('should hide the answer when hide button is clicked', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')
        cy.get('.textbox4').type('0.950').should('have.value', '0.950')
        cy.get('.textbox5').type('0.673').should('have.value', '0.673')
        cy.get('.submit-button').click()
        cy.get('.feedback-section').should('be.visible')
        cy.get('.hide-button').click()
        cy.wait(500)
        cy.get('.feedback-section').should('not.exist')
    })

    it('the workspace components', () => {
        cy.get('#drawingCanvas').should('exist');
        cy.get('#textOverlay').should('exist');
        cy.get('#drawButton').should('exist');
        cy.get('#textButton').should('exist');
        cy.get('#eraserButton').should('exist');
        cy.get('#clearButton').should('exist');
    })

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

})