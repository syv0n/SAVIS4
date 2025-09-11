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
})