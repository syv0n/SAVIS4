describe('TPCI Problems Homework Features', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/problems-tpci')
    })

    it('should have tpci homework features', () => {
        cy.contains('Two Proportion Confidence Interval Problems').should('be.visible')
        cy.get('.green-box').should('contains.text', '.')
        cy.contains('button', 'New Problem').should('be.visible')
        cy.contains('button', 'Check Answer').should('be.visible')
        cy.get('.chart-container').should('be.visible')
    })

    it('should generate new problem when button is clicked', () => {
        cy.contains('button', 'New Problem').click()
        cy.wait(500)
        cy.contains('.green-box').should('not.be.empty')
    })
    
    it('should allow typing in the answer box ', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')    
    })

    it('should show if answers is correct or incorrect', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')
        cy.get('.textbox4').type('0.950').should('have.value', '0.950')
        cy.get('.textbox5').type('0.673').should('have.value', '0.673')
        cy.get('.submit-button').click()
        cy.get('.feedback-section').should('be.visible')
    })

    it('should hide the answer when hide button is clicked', () => {
        cy.get('.textbox').type('0.123').should('have.value', '0.123')
        cy.get('.textbox1').type('0.456').should('have.value', '0.456')
        cy.get('.textbox2').type('0.789').should('have.value', '0.789')
        cy.get('.textbox3').type('0.101').should('have.value', '0.101')
        cy.get('.textbox4').type('0.950').should('have.value', '0.950')
        cy.get('.textbox5').type('0.673').should('have.value', '0.673')
        cy.get('.submit-button').click()
        cy.get('.feedback-section').should('be.visible')
        cy.get('.hide-button').click()
        cy.wait(500)
        cy.get('.feedback-section').should('not.exist')
    })

})