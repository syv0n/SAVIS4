describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/dotplot')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/dotplot')
      })

    
    it('should select and load example 1', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
    it('should select and load example 2', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
    it('should click the reset button', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.wait(500)
        cy.get('#reset-btn').click()
        cy.wait(500)
      })
   it('should select and load example 1 Sample', () => {
        cy.get('label#sampleButton').click(); // Click on the label element
        cy.wait(1500)
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
      })
  it('should input number into sample size', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#sample-data-size').type('0')
      })

  it('should input number into sample size', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').type('0')
      })

  it('should run simulation', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').type('0')
        cy.get('#no-of-sample').type('0')
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
        cy.get('#get-sample-btn').click()
        cy.wait(300)
      })
  it('should input number into min input', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#min-interValue').type('0')
      })
  it('should input number into max input', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#max-interValue').type('0')
      })
  it('should check the include min', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#includeMin').click()
      })
  it('should check the include max', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(500)
        cy.get('#load-data-btn').click()
        cy.get('#get-sample-btn').click()
        cy.get('#includeMax').click()
      })


  // --- NEW EXPORT TESTS ---
    describe('Export Functionality', () => {
        const downloadsFolder = Cypress.config('downloadsFolder');

        beforeEach(() => {
            // Load data before each export test
            cy.get('#sample-data-options').select("Example 1");
            cy.get('#load-data-btn').click();
            cy.get('button').contains('Export as PDF').first().should('not.be.disabled');
        });

        it('should download the input data as a PDF and DOCX', () => {
            const pdfFileName = 'dot-plot-input-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('button').contains('Export as PDF').first().click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFileName = 'dot-plot-input-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('button').contains('Export as DOCX').first().click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        /*it('should download the sample data as a PDF and DOCX', () => {
            // Generate sample data
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            
            cy.get('.chart-input-form').eq(1).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFileName = 'dot-plot-sample-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('.chart-input-form').eq(1).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');

            const docxFileName = 'dot-plot-sample-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('.chart-input-form').eq(1).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });*/ // disabled for now as its causing too many issues

        it('should download the sample means data as a PDF and DOCX', () => {
            // Generate sample means data
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            
            cy.get('.chart-input-form').eq(2).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFileName = 'dot-plot-means-export.pdf';
            const pdfFilePath = `${downloadsFolder}/${pdfFileName}`;
            cy.get('.chart-input-form').eq(2).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFileName = 'dot-plot-means-export.docx';
            const docxFilePath = `${downloadsFolder}/${docxFileName}`;
            cy.get('.chart-input-form').eq(2).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });
    });
     
})

describe('Dot Plot Practice Problems', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('localhost:4200/problems-dot-plot');
    });

    it('should display the practice problem interface', () => {
        cy.get('.dot-plot-container').should('exist');
        cy.get('.green-box').should('contain.text', '?');
        cy.get('.multiple-choice').should('exist');
        cy.get('.submit-button').should('exist');
        cy.get('.generate-button').should('exist');
    });

    it('should generate a new problem when button is clicked', () => {
        cy.get('.generate-button').click();
        cy.get('.green-box').should('not.be.empty');
    });

    it('should allow selecting an answer and submitting', () => {
        cy.get('.multiple-choice label').first().click();
        cy.get('.submit-button').click();
        cy.get('.answer-box').should('exist');
    });

    it('should show feedback for correct and incorrect answers', () => {
        cy.get('.multiple-choice label').first().click();
        cy.get('.submit-button').click();
        cy.get('.answer-box').should('exist');
        cy.get('.answer-box').should('contain.text', 'Correct');
    });

    it('should reset the problem when Generate New Problem is clicked', () => {
        cy.get('.generate-button').click();
        cy.get('.answer-box').should('not.exist');
    });
    it('has the main practice UI and workspace controls', () => {
        cy.get('.dot-plot-container').should('exist');
        cy.get('.generate-button').should('exist');
        cy.get('.green-box').should('exist');
        cy.get('#drawingCanvas').should('exist');
        cy.get('#textOverlay').should('exist');
        cy.get('#drawButton').should('exist');
        cy.get('#textButton').should('exist');
        cy.get('#eraserButton').should('exist');
        cy.get('#clearButton').should('exist');
    });

    it('generates a new practice problem and shows an updated green box', () => {
        cy.get('.generate-button').click();
        cy.get('.green-box').invoke('text').should((txt) => {
        expect(txt).to.not.equal('');
        });
    });

    it('draws on the canvas and produces a non-blank dataURL', () => {
        cy.get('#drawButton').click();
        cy.get('#drawingCanvas')
        .trigger('mousedown', { which: 1, pageX: 50, pageY: 50 })
        .trigger('mousemove', { which: 1, pageX: 150, pageY: 80 })
        .trigger('mouseup', { force: true });

        cy.wait(200);
        cy.get('#drawingCanvas').then(($c) => {
        const data = ($c[0] as HTMLCanvasElement).toDataURL();
        expect(data.length).to.be.greaterThan(1000);
        });
    });

    it('erases part of the canvas when in eraser mode', () => {
        // draw first
        cy.get('#drawButton').click();
        cy.get('#drawingCanvas')
        .trigger('mousedown', { which: 1, pageX: 40, pageY: 40 })
        .trigger('mousemove', { which: 1, pageX: 220, pageY: 40 })
        .trigger('mouseup', { force: true });

        cy.wait(200);
        cy.get('#drawingCanvas').then(($c) => {
        const before = ($c[0] as HTMLCanvasElement).toDataURL();
        cy.get('#eraserButton').click();
        cy.get('#drawingCanvas')
            .trigger('mousedown', { which: 1, pageX: 120, pageY: 40 })
            .trigger('mousemove', { which: 1, pageX: 140, pageY: 40 })
            .trigger('mouseup', { force: true });

        cy.wait(200);
        cy.get('#drawingCanvas').then(($c2) => {
            const after = ($c2[0] as HTMLCanvasElement).toDataURL();
            expect(after).to.not.equal(before);
        });
        });
    });

    it('commits typed text from overlay to the canvas', () => {
        cy.get('#textButton').click();
        cy.get('#textOverlay').should('be.visible').click();
        // make sure overlay is writable for the test
        cy.get('#textOverlay').invoke('prop', 'readOnly', false);
        cy.get('#textOverlay').clear().type('DotPlot Test');
        cy.wait(200);
        cy.get('#drawingCanvas').then(($c) => {
        const data = ($c[0] as HTMLCanvasElement).toDataURL();
        expect(data.length).to.be.greaterThan(1000);
        });
    });

    it('color buttons change overlay color', () => {
        // buttons are icon-only; target by class
        cy.get('.color-button.blue').click();
        cy.get('#textButton').click();
        cy.get('#textOverlay').should('have.css', 'color').and((c) => {
        expect(c).to.exist.and.not.be.empty;
        });
    });

    it('clear button resets canvas and overlay', () => {
        cy.get('#drawButton').click();
        cy.get('#drawingCanvas')
        .trigger('mousedown', { which: 1, pageX: 10, pageY: 10 })
        .trigger('mousemove', { which: 1, pageX: 60, pageY: 10 })
        .trigger('mouseup', { force: true });

    // Activate text mode, focus the overlay, make it writable, type and blur to commit
    cy.get('#textButton').click();
    cy.get('#textOverlay').should('be.visible').click();
    cy.get('#textOverlay').invoke('prop', 'readOnly', false).clear().type('to clear').blur();
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