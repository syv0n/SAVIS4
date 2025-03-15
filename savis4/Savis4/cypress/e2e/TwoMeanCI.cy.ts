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
})