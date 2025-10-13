describe('TwoMeanCI', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:4200/twomeansCI')
    })

    it('page loads', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:4200/twomeansCI')

        cy.get('#runSim').should('be.disabled')
        cy.get('#simInput').should('be.disabled')
        cy.get('#build').should('be.disabled')
    })

    it('sample data', () => {
        cy.get('#select').select('Sample 1')
        cy.get('#loadData').click()

        cy.get('#increment').type('{selectAll}{backspace}20')
        cy.get('#incrementBtn').click()
        cy.get('#incrementButton').click()

        cy.get('#simInput').type('{selectAll}{backspace}1000')
        cy.get('#runSim').click()

        cy.get('#confidence-level')
        .invoke("val", 65)
        .trigger('change')
        .click({ force: true })

        cy.get('#build').click()

        cy.get('#confidence-level')
        .invoke("val", 25)
        .trigger('change')
        .click({ force: true })

        cy.get('#build').click()
    })

    it('inputing data works', () => {
        cy.get('#textArea').type('1,2.6\n3,4.4\n6,7.8\n2,3.4\n5,6.7\n')
        cy.get('#loadData').click()
    })

    // it('Reset button works', () => {
    //     cy.get('#select').select('Sample 1')
    //     cy.get('#loadData').click()

    //     cy.get('#increment').type('{selectAll}{backspace}20')
    //     cy.get('#incrementBtn').click()
    //     cy.get('#incrementButton').click()

    //     cy.get('#simInput').type('{selectAll}{backspace}1000')
    //     cy.get('#runSim').click()

    //     cy.get('#confidence-level')
    //     .invoke("val", 65)
    //     .trigger('change')
    //     .click({ force: true })

    //     cy.get('#build').click()

    //     cy.get('#confidence-level')
    //     .invoke("val", 25)
    //     .trigger('change')
    //     .click({ force: true })

    //     cy.get('#build').click()

    //     cy.get('#reset').click()
    // })

    describe('Export Functionality', () => {
        it('should have export buttons visible but disabled initially', () => {
            cy.get('#export-pdf-btn').should('be.visible').and('be.disabled')
            cy.get('#export-docx-btn').should('be.visible').and('be.disabled')
        })

        it('should enable export buttons after completing workflow', () => {
            // Complete the full workflow
            cy.get('#select').select('Sample 1')
            cy.get('#loadData').click()
            cy.get('#increment').type('{selectAll}{backspace}20')
            cy.get('#incrementBtn').click()
            cy.get('#incrementButton').click()
            cy.get('#simInput').type('{selectAll}{backspace}1000')
            cy.get('#runSim').click()
            cy.get('#confidence-level')
                .invoke("val", 65)
                .trigger('change')
                .click({ force: true })
            cy.get('#build').click()
            
            // Export buttons should be enabled
            cy.get('#export-pdf-btn').should('be.enabled')
            cy.get('#export-docx-btn').should('be.enabled')
        })

        it('should successfully export PDF', () => {
            // Complete workflow
            cy.get('#select').select('Sample 1')
            cy.get('#loadData').click()
            cy.get('#increment').type('{selectAll}{backspace}20')
            cy.get('#incrementBtn').click()
            cy.get('#incrementButton').click()
            cy.get('#simInput').type('{selectAll}{backspace}1000')
            cy.get('#runSim').click()
            cy.get('#confidence-level')
                .invoke("val", 65)
                .trigger('change')
                .click({ force: true })
            cy.get('#build').click()
            
            // Export PDF
            cy.get('#export-pdf-btn').should('be.enabled').click()
            cy.wait(2000) // Allow time for download
            
            // Verify button remains functional
            cy.get('#export-pdf-btn').should('be.enabled')
        })

        it('should successfully export DOCX', () => {
            // Complete workflow
            cy.get('#select').select('Sample 1')
            cy.get('#loadData').click()
            cy.get('#increment').type('{selectAll}{backspace}20')
            cy.get('#incrementBtn').click()
            cy.get('#incrementButton').click()
            cy.get('#simInput').type('{selectAll}{backspace}1000')
            cy.get('#runSim').click()
            cy.get('#confidence-level')
                .invoke("val", 65)
                .trigger('change')
                .click({ force: true })
            cy.get('#build').click()
            
            // Export DOCX
            cy.get('#export-docx-btn').should('be.enabled').click()
            cy.wait(2000) // Allow time for download
            
            // Verify button remains functional
            cy.get('#export-docx-btn').should('be.enabled')
        })
    })
})