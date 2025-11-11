describe('OPHT Problems Homework Features', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems-opht')
    })

    it('should have opht homework features', () => {
        cy.contains('One Proportion Hypothesis Testing Problems').should('be.visible')
        cy.get('.green-box').should('contains.text', '.')
        cy.contains('button', 'New Problem').should('be.visible')
        cy.contains('button', 'Check Answers').should('be.visible')
        cy.get('.chart-container').should('be.visible')
        cy.get('.chart-container canvas').should('exist')
    })

    it('should generate new problem when button is clicked', () => {
        cy.contains('button', 'New Problem').click()
        cy.wait(500)
        cy.contains('.green-box').should('not.be.empty')
    })

    it('should allow typing into OPHT fields', () => {
        cy.get('.field1 input').type('0.123').should('have.value', '0.123')
        cy.get('.field2 input').type('0.456').should('have.value', '0.456')
        cy.get('.field3 input').type('0.789').should('have.value', '0.789')

        //cy.get('.field4 select').type('Reject H₀').should('have.value', 'Reject H₀')
        cy.get('.field4 select').select(1)
        cy.get('.field4 select option:selected').should('have.text', 'Reject H₀');
    })

    it('should show if answers if correct or incorrect', () => {
        cy.get('.field1 input').type('0.123').should('have.value', '0.123')
        cy.get('.field2 input').type('0.456').should('have.value', '0.456')
        cy.get('.field3 input').type('0.789').should('have.value', '0.789')

        cy.get('.field4 select').select(1)
        cy.get('.field4 select option:selected').should('have.text', 'Reject H₀');
        cy.get('.submit-button').click()
        cy.get('.answer-box').should('be.visible')
    })

    it('should hide the answer when hid button is clicked', () => {
        cy.get('.field1 input').type('0.123').should('have.value', '0.123')
        cy.get('.field2 input').type('0.456').should('have.value', '0.456')
        cy.get('.field3 input').type('0.789').should('have.value', '0.789')

        cy.get('.field4 select').select(1)
        cy.get('.field4 select option:selected').should('have.text', 'Reject H₀');
        cy.get('.submit-button').click()
        cy.get('.answer-box').should('be.visible')
        cy.get('.hide-button').click()
        cy.wait(500)
        cy.get('.answer-box').should('not.exist')
    })
})

// cypress/e2e/problemsOPHT.cy.ts  — workspace tests for OPHT (prefixed IDs)
describe('OPHT Workspace', () => {
  const route = 'http://localhost:4200/problems-opht';

  const drawShortStroke = (canvasSel: string) => {
    cy.get(canvasSel).then(($c) => {
      const r = ($c[0] as HTMLCanvasElement).getBoundingClientRect();
      const start = { clientX: r.left + 40,  clientY: r.top + 40 };
      const end   = { clientX: r.left + 240, clientY: r.top + 40 };
      cy.wrap($c)
        .trigger('mousedown', { ...start, which: 1, force: true })
        .trigger('mousemove', { ...end,   which: 1, force: true })
        .trigger('mouseup',   { force: true });
    });
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(route);
    cy.get('#ophtWorkspaceRoot').should('exist');
    cy.get('#ophtDrawingCanvas').should('exist');
    cy.get('#ophtDrawButton').should('exist');
    cy.get('#ophtTextButton').should('exist');
    cy.get('#ophtEraserButton').should('exist');
    cy.get('#ophtClearButton').should('exist');
  });

  it('draw mode produces pixels on the canvas', () => {
    cy.get('#ophtDrawButton').click();
    drawShortStroke('#ophtDrawingCanvas');
    cy.wait(120);
    cy.get('#ophtDrawingCanvas').then(($c) => {
      const data = ($c[0] as HTMLCanvasElement).toDataURL();
      expect(data.length).to.be.greaterThan(1000);
    });
  });

  it('eraser removes pixels (dataURL changes after erasing)', () => {
    cy.get('#ophtDrawButton').click();
    drawShortStroke('#ophtDrawingCanvas');

    cy.wait(100);
    cy.get('#ophtDrawingCanvas').then(($c) => {
      const before = ($c[0] as HTMLCanvasElement).toDataURL();

      cy.get('#ophtEraserButton').click();
      cy.get('#ophtDrawingCanvas').then(($c2) => {
        const r = ($c2[0] as HTMLCanvasElement).getBoundingClientRect();
        const start = { clientX: r.left + 120, clientY: r.top + 40 };
        const end   = { clientX: r.left + 160, clientY: r.top + 40 };
        cy.wrap($c2)
          .trigger('mousedown', { ...start, which: 1, force: true })
          .trigger('mousemove', { ...end,   which: 1, force: true })
          .trigger('mouseup',   { force: true });
      });

      cy.wait(120);
      cy.get('#ophtDrawingCanvas').then(($c3) => {
        const after = ($c3[0] as HTMLCanvasElement).toDataURL();
        expect(after).to.not.equal(before);
      });
    });
  });

  it('text overlay can be edited and committed into the canvas', () => {
    cy.get('#ophtTextButton').click();
    cy.get('#ophtTextOverlay').should('be.visible').click();

    // overlay starts readOnly until clicked; ensure writable
    cy.get('#ophtTextOverlay')
      .invoke('prop', 'readOnly', false)
      .clear({ force: true })
      .type('Hello OPHT!', { delay: 0 });

    // switching back to draw commits overlay text into canvas
    cy.get('#ophtDrawButton').click();

    cy.wait(120);
    cy.get('#ophtDrawingCanvas').then(($c) => {
      const data = ($c[0] as HTMLCanvasElement).toDataURL();
      expect(data.length).to.be.greaterThan(1000);
    });
  });

  it('color buttons update overlay color (e.g., red)', () => {
    cy.get('#ophtWorkspaceRoot .color-button.red').click();
    cy.get('#ophtTextButton').click();
    cy.get('#ophtTextOverlay')
      .should('be.visible')
      .should('have.css', 'color')
      .and((val) => {
        const color = val as unknown as string;
        expect(color.replace(/\s+/g, '')).to.match(/rgb(a)?\((255,0,0)(,1|)\)/);
    });
  });

  it('clear removes overlay text and clears canvas content', () => {
    // draw something
    cy.get('#ophtDrawButton').click();
    drawShortStroke('#ophtDrawingCanvas');

    // add & commit text
    cy.get('#ophtTextButton').click();
    cy.get('#ophtTextOverlay')
      .should('be.visible')
      .invoke('prop', 'readOnly', false)
      .clear({ force: true })
      .type('clear this', { delay: 0 });
    cy.get('#ophtDrawButton').click();

    cy.get('#ophtDrawingCanvas').then(($c) => {
      const filled = ($c[0] as HTMLCanvasElement).toDataURL();
      cy.get('#ophtClearButton').click();
      cy.wait(120);
      cy.get('#ophtDrawingCanvas').then(($c2) => {
        const cleared = ($c2[0] as HTMLCanvasElement).toDataURL();
        expect(cleared).to.not.equal(filled);
      });
    });

    cy.get('#ophtTextButton').click();
    cy.get('#ophtTextOverlay').should('have.value', '');
  });
});
