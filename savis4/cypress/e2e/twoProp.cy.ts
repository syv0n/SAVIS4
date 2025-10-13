describe('Two Proportion Test', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/twoproportions')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/twoproportions')
    })

    it('should input fields', () => {
        cy.get('#a-success').type('{selectAll}{backspace}20')
        cy.get('#a-failure').type('{selectAll}{backspace}50')
        cy.get('#b-success').type('{selectAll}{backspace}30')
        cy.get('#b-failure').type('{selectAll}{backspace}15')

        cy.get('#load-button').click()

        cy.get('#simInput').type('{selectAll}{backspace}1000')
        cy.get('#runSim').click()

        cy.get('#minInput').type('{selectAll}{backspace}0.09')
        cy.get('#maxInput').type('{selectAll}{backspace}0.75')
    })

// --- EXPORT TESTS ---
    describe('Export Functionality', () => {
        const downloadsFolder = Cypress.config('downloadsFolder');

        beforeEach(() => {
            cy.get('#a-success').type('{selectAll}{backspace}20');
            cy.get('#a-failure').type('{selectAll}{backspace}50');
            cy.get('#b-success').type('{selectAll}{backspace}30');
            cy.get('#b-failure').type('{selectAll}{backspace}15');
            cy.get('#load-button').click();
            cy.get('.export-buttons').first().find('button').contains('Export as PDF').should('not.be.disabled');
        });

        it('should download the original data as a PDF and DOCX', () => {
            const pdfFilePath = `${downloadsFolder}/two-proportions-data-export.pdf`;
            cy.get('.export-buttons').first().find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFilePath = `${downloadsFolder}/two-proportions-data-export.docx`;
            cy.get('.export-buttons').first().find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the simulation data as a PDF and DOCX', () => {
            // Added assertion to wait for the button to be enabled
            cy.get('#runSim').should('not.be.disabled').click();
            cy.get('.export-buttons').eq(1).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFilePath = `${downloadsFolder}/two-proportions-simulation-export.pdf`;
            cy.get('.export-buttons').eq(1).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');

            const docxFilePath = `${downloadsFolder}/two-proportions-simulation-export.docx`;
            cy.get('.export-buttons').eq(1).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });

        it('should download the distribution data as a PDF and DOCX', () => {
            // Added assertion to wait for the button to be enabled
            cy.get('#runSim').should('not.be.disabled').click();
            cy.get('.export-buttons').eq(2).find('button').contains('Export as PDF').should('not.be.disabled');

            const pdfFilePath = `${downloadsFolder}/two-proportions-distribution-export.pdf`;
            cy.get('.export-buttons').eq(2).find('button').contains('Export as PDF').click();
            cy.task('checkFileExists', pdfFilePath).should('be.true');
            
            const docxFilePath = `${downloadsFolder}/two-proportions-distribution-export.docx`;
            cy.get('.export-buttons').eq(2).find('button').contains('Export as DOCX').click();
            cy.task('checkFileExists', docxFilePath).should('be.true');
        });
    });
    
})