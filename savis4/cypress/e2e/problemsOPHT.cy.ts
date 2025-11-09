describe('OPHT Problems Homework Features', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems-opht')
    })

    it('should have opht homework features', () => {
        cy.contains('One Proportion Hypothesis Testing Problems').should('be.visible')
        cy.get('.green-box').should('contains.text', '.')
        cy.contains('button', 'Generate New Problem').should('be.visible')
        cy.contains('button', 'Submit Answer').should('be.visible')
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