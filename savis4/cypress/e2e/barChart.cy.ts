describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/barchart')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/barchart')
      })


      it('should select "Sample 1" and load it from the drop down menu', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
    })
  

    it('should select "Sample 2" and load it from the drop down menu', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
    })
    
    it('should input and load data', () => {
        cy.get('#csv-input').type(`Honda,\nToyota,\nKia,\nTesla,\nBMW,\nFord,\nToyota,\nFord`)
        cy.wait(1000)
        cy.get('#load-data-btn').click()
    })
    it('should click the reset button', () => {
        cy.window().then((win) => {
            cy.stub(win.console, 'log').as('consoleLog');
          });
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
        cy.wait(1000)
        cy.get('#reset-btn').click(({force: true}))
        cy.get('@consoleLog').should('have.been.calledWith', 'reset') 

    })

    // it('should select the "Upload Data File" button', () => {
    //     cy.window().then((win) => {
    //         cy.stub(win.console, 'log').as('consoleLog');
    //       });
    //     cy.get('#upload-btn').click()
    //     cy.get('@consoleLog').should('have.been.calledWith', 'upload file') 
    // })


    it('should make sure the frequency chat doesnt exist without any data', () => {
        cy.get(':nth-child(2) > #result').should('not.exist')
        
    })


    it('should make sure the frequency chat DOES exist without any data', () => {
        cy.get('#sample-data-options').select("Example 2")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
        cy.get(':nth-child(2) > #result').should('exist')
    })

    
    it ('should check if run simulation button is disabled on an empty chart', () => {
        cy.get('#get-sample-btn').should('be.disabled')
    })


    it('should input value in the "Draw Sample" input and run simulation', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
        cy.get('#sampleInput').type("3")
        cy.wait(1000)
        cy.get('#get-sample-btn').click()
        cy.wait(1000)
        cy.get('#get-sample-btn').click()
        cy.wait(1000)
        cy.get('#get-sample-btn').click()
    })


    it('should make sure the frequency table for "Draw Sample" doesnt exist without any data', () => {
        cy.get(':nth-child(4) > #result').should('not.exist')
    })


    it('should make sure the frequency table for "Draw Sample" Does exist without any data', () => {
        cy.get('#sample-data-options').select("Example 1")
        cy.wait(1000)
        cy.get('#load-data-btn').click()
        cy.get('#sampleInput').type("3")
        cy.wait(1000)
        cy.get('#get-sample-btn').click()
        cy.wait(1000)
        cy.get(':nth-child(4) > #result').should('exist')
    })

      // --- NEW EXPORT TESTS ---
    describe('Export Functionality', () => {
        const downloadsFolder = Cypress.config('downloadsFolder');

        beforeEach(() => {
            // Load data before each export test
            cy.get('#sample-data-options').select("Example 1");
            cy.get('#load-data-btn').click();
            //cy.get('#export-input-pdf-btn').should('not.be.disabled');
        });

        // THIS TEST WAS INCORRECT. IT SHOULD ONLY TEST THE INPUT DATA EXPORT.
        it('should download the input data as a PDF', () => {
            const fileName = 'bar-chart-input-export.pdf';
            const filePath = `${downloadsFolder}/${fileName}`;
            
            // Correct action: Just click the input data export button.
            cy.get('#export-input-pdf-btn').click();
            cy.task('checkFileExists', filePath).should('be.true');
        });

        it('should download the input data as a DOCX', () => {
            const fileName = 'bar-chart-input-export.docx';
            const filePath = `${downloadsFolder}/${fileName}`;

            cy.get('#export-input-docx-btn').click();
            cy.task('checkFileExists', filePath).should('be.true');
        });

        // THIS TEST HAD THE WRONG ORDER OF ACTIONS.
        it('should download the sample data as a PDF', () => {
            const fileName = 'bar-chart-sample-export.pdf';
            const filePath = `${downloadsFolder}/${fileName}`;

            // Correct order:
            // 1. Type in the sample size.
            cy.get('#sampleInput').clear().type('5');
            // 2. Generate the sample data.
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            // 3. Now that data exists, click the export button.
            cy.get('#export-sample-pdf-btn').should('not.be.disabled').click();

            cy.task('checkFileExists', filePath).should('be.true');
        });

        it('should download the sample data as a DOCX', () => {
            const fileName = 'bar-chart-sample-export.docx';
            const filePath = `${downloadsFolder}/${fileName}`;

            // Correct order:
            cy.get('#sampleInput').clear().type('5');
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            cy.get('#export-sample-docx-btn').should('not.be.disabled').click();

            cy.task('checkFileExists', filePath).should('be.true');
        });
    });

    describe('Bar Chart Practice Problems', () => {
        beforeEach(() => {
            cy.viewport(1920, 1080);
            cy.visit('localhost:4200/problems-bar-chart');
        });

        it('should display the practice problem interface', () => {
            cy.get('.bar-chart-container').should('exist');
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
    });
})