describe('One Mean Hypothesis Testing', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/onemean')
    })
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/onemean')
    })

    it('should enter numbers and load the data', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
    })
    it('should select choose file', () => {
      cy.get('#upload-btn').click({ force: true });
    })

    it('should input data in the sample size box', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#sample-data-size').clear()
        cy.get('#sample-data-size').type('5')
        cy.get('#get-sample-btn').click()
        cy.wait(500)
    })
    it('should input data in the sample number box', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
    })
    it('should increase and decrease the MIN value', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
        cy.get('#min-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#min-interValue').type('{downarrow}')
        cy.wait(200)
    })
    it('should increase and decrease the MAX value', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
        cy.get('#max-interValue').type('{uparrow}')
        cy.wait(200)
        cy.get('#max-interValue').type('{downarrow}')
        cy.wait(200)
    })
    it('should check the "include min" box', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
        cy.get('#includeMin').click()
    })
    it('should check the "include max" box', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
        cy.get('#includeMax').click()
    })
    it('should reset data', () => {
        cy.get('#csv-input').type('95 \n 84 \n 70\n85\n71\n88\n95\n69\n')
        cy.get('#load-data-btn').click()
        cy.get('#no-of-sample').clear()
        cy.get('#no-of-sample').type('6')
        cy.get('#get-sample-btn').click()
        cy.get('#includeMin').click()
        cy.get('#reset-btn').click()
        cy.wait(1000)
    })

    // --- NEW EXPORT TESTS ---
    describe('Export Functionality', () => {
        const downloadsFolder = Cypress.config('downloadsFolder');

        beforeEach(() => {
            // Step 1: Select the sample data
            cy.get('#sample-data-options').select("sample1");
            
            // ADDED: Wait for the textarea to be populated by the async fetch request
            cy.get('#csv-input').should('not.have.value', '');
            
            // Step 2: Now that the data is loaded, click the button
            cy.get('#load-data-btn').click();

            // Step 3: The assertion will now pass
            cy.get('.export-buttons').first().find('button').contains('Export as PDF').should('not.be.disabled');
        });

        it('should download the input data as a PDF and DOCX', () => {
            const pdfFilePath = `${downloadsFolder}/one-mean-data-export.pdf`;
            cy.get('.export-buttons').first().find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFilePath = `${downloadsFolder}/one-mean-data-export.docx`;
            cy.get('.export-buttons').first().find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the sample data as a PDF and DOCX', () => {
            // Added .should('not.be.disabled') to wait for the button
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            cy.get('.export-buttons').eq(1).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFilePath = `${downloadsFolder}/one-mean-sample-export.pdf`;
            cy.get('.export-buttons').eq(1).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');

            const docxFilePath = `${downloadsFolder}/one-mean-sample-export.docx`;
            cy.get('.export-buttons').eq(1).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the sample means distribution data as a PDF and DOCX', () => {
            // Added .should('not.be.disabled') to wait for the button
            cy.get('#get-sample-btn').should('not.be.disabled').click();
            cy.get('.export-buttons').eq(2).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFilePath = `${downloadsFolder}/one-mean-distribution-export.pdf`;
            cy.get('.export-buttons').eq(2).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFilePath = `${downloadsFolder}/one-mean-distribution-export.docx`;
            cy.get('.export-buttons').eq(2).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });
    });
})