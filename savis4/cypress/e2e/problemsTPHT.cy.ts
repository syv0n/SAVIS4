describe('TPHT Problems Homework Features', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems-tpht')
    })

    it('should have Tpht homework features', () => {
        cy.contains('Two Proportion Hypothesis Testing Problems').should('be.visible')
        cy.get('.green-box').should('contains.text', '.')
        cy.contains('button', 'New Problem').should('be.visible')
        cy.contains('button', 'Check Answer').should('be.visible')
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
        cy.get('.field4 input').type('0.101').should('have.value', '0.101')

        cy.get('.field5 select').select(1)
        cy.get('.field5 select option:selected').should('have.text', 'Reject H₀');
    })

    it('should show if answers if correct or incorrect', () => {
        cy.get('.field1 input').type('0.123').should('have.value', '0.123')
        cy.get('.field2 input').type('0.456').should('have.value', '0.456')
        cy.get('.field3 input').type('0.789').should('have.value', '0.789')
        cy.get('.field4 input').type('0.101').should('have.value', '0.101')

        cy.get('.field5 select').select(1)
        cy.get('.field5 select option:selected').should('have.text', 'Reject H₀');
        cy.get('.submit-button').click()
        cy.get('.answer-box').should('be.visible')
    })

    it('should hide the answer when hid button is clicked', () => {
        cy.get('.field1 input').type('0.123').should('have.value', '0.123')
        cy.get('.field2 input').type('0.456').should('have.value', '0.456')
        cy.get('.field3 input').type('0.789').should('have.value', '0.789')
        cy.get('.field4 input').type('0.101').should('have.value', '0.101')

        cy.get('.field5 select').select(1)
        cy.get('.field5 select option:selected').should('have.text', 'Reject H₀');
        cy.get('.submit-button').click()
        cy.get('.answer-box').should('be.visible')
        cy.get('.hide-button').click()
        cy.wait(500)
        cy.get('.answer-box').should('not.exist')
    })
})

describe('TPHT Workspace', () => {
  const route = 'http://localhost:4200/problems-tpht';

  const drawShortStroke = (canvasSel: string) => {
    cy.get(canvasSel).then(($c) => {
      const r = ($c[0] as HTMLCanvasElement).getBoundingClientRect();
      const start = { clientX: r.left + 40, clientY: r.top + 40 };
      const end   = { clientX: r.left + 240, clientY: r.top + 40 };

      cy.wrap($c)
        .trigger('mousedown', { ...start, which: 1, force: true })
        .trigger('mousemove', { ...end, which: 1, force: true })
        .trigger('mouseup',   { force: true });
    });
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit(route);
    // sanity: workspace present
    cy.get('.tpht-workspace').should('be.visible');
    cy.get('#tphtDrawingCanvas').should('exist');
    cy.get('#tphtDrawButton').should('exist');
    cy.get('#tphtTextButton').should('exist');
    cy.get('#tphtEraserButton').should('exist');
    cy.get('#tphtClearButton').should('exist');
  });

  it('draw mode produces pixels on the canvas', () => {
    cy.get('#tphtDrawButton').click();
    drawShortStroke('#tphtDrawingCanvas');

    cy.wait(150);
    cy.get('#tphtDrawingCanvas').then(($c) => {
      const data = ($c[0] as HTMLCanvasElement).toDataURL();
      expect(data.length).to.be.greaterThan(1000); // non-empty image
    });
  });

  it('eraser removes pixels (dataURL changes after erasing)', () => {
    cy.get('#tphtDrawButton').click();
    drawShortStroke('#tphtDrawingCanvas');

    cy.wait(120);
    cy.get('#tphtDrawingCanvas').then(($c) => {
      const before = ($c[0] as HTMLCanvasElement).toDataURL();

      cy.get('#tphtEraserButton').click();
      cy.get('#tphtDrawingCanvas').then(($c2) => {
        const r = ($c2[0] as HTMLCanvasElement).getBoundingClientRect();
        const start = { clientX: r.left + 120, clientY: r.top + 40 };
        const end   = { clientX: r.left + 160, clientY: r.top + 40 };

        cy.wrap($c2)
          .trigger('mousedown', { ...start, which: 1, force: true })
          .trigger('mousemove', { ...end,   which: 1, force: true })
          .trigger('mouseup',   { force: true });
      });

      cy.wait(120);
      cy.get('#tphtDrawingCanvas').then(($c3) => {
        const after = ($c3[0] as HTMLCanvasElement).toDataURL();
        expect(after).to.not.equal(before);
      });
    });
  });

  it('text overlay can be edited and committed into the canvas', () => {
    cy.get('#tphtTextButton').click();
    cy.get('#tphtTextOverlay').should('be.visible').click();
    // make sure it’s writable in test context
    cy.get('#tphtTextOverlay').invoke('prop', 'readOnly', false).clear().type('Hello TPHT!');
    // switch to draw mode to commit overlay text into canvas
    cy.get('#tphtDrawButton').click();

    cy.wait(150);
    cy.get('#tphtDrawingCanvas').then(($c) => {
      const data = ($c[0] as HTMLCanvasElement).toDataURL();
      expect(data.length).to.be.greaterThan(1000);
    });
  });

  it('color buttons update overlay color (e.g., red)', () => {
    cy.get('.tpht-workspace .color-button.red').click();
    cy.get('#tphtTextButton').click();
    cy.get('#tphtTextOverlay')
      .should('be.visible')
      .should('have.css', 'color')
      .and('match', /rgb\(\s*255,\s*0,\s*0\)/); // red in rgb
  });

  it('clear removes overlay text and clears canvas content', () => {
    // draw something
    cy.get('#tphtDrawButton').click();
    drawShortStroke('#tphtDrawingCanvas');

    // add some text and commit
    cy.get('#tphtTextButton').click();
    cy.get('#tphtTextOverlay').invoke('prop', 'readOnly', false).clear().type('clear this');
    cy.get('#tphtDrawButton').click();

    cy.get('#tphtDrawingCanvas').then(($c) => {
      const filled = ($c[0] as HTMLCanvasElement).toDataURL();

      cy.get('#tphtClearButton').click();
      cy.wait(120);

      cy.get('#tphtDrawingCanvas').then(($c2) => {
        const cleared = ($c2[0] as HTMLCanvasElement).toDataURL();
        expect(cleared).to.not.equal(filled);
      });
    });

    cy.get('#tphtTextButton').click();
    cy.get('#tphtTextOverlay').should('have.value', '');
  });
});
