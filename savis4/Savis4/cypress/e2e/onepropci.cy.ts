describe('One Proprtion Confidence Interval', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/oneproportionCI')
    })

    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/oneproportionCI')
        cy.get('#sample-size').should('be.disabled')
        cy.get('#numOfSims').should('be.disabled')
        cy.get('#runSim').should('be.disabled')
    })

    it('should input fields (Confidence Interval test)', () => {
        cy.get('#sample-size').should('be.disabled')
        cy.get('#numOfSims').should('be.disabled')
        cy.get('#runSim').should('be.disabled')

        cy.get('#success').type('20')
        cy.get('#failure').type('500')
        cy.get('.load-button').click()

        cy.get('#sample-size').should('be.enabled')
        cy.get('#numOfSims').should('be.enabled')
        cy.get('#runSim').should('be.enabled')

        cy.get('#sample-size').type('10')
        cy.get('#numOfSims').type('10000')
        cy.get('#runSim').click()

        cy.get('#confidence-level')
        .invoke("val", 65)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 70)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 25)
        .trigger("change")
        .click({ force: true })
    })

    it('should input fields (Min Max test)', () => {
        cy.get('#sample-size').should('be.disabled')
        cy.get('#numOfSims').should('be.disabled')
        cy.get('#runSim').should('be.disabled')

        cy.get('#success').type('60')
        cy.get('#failure').type('20')
        cy.get('.load-button').click()

        cy.get('#sample-size').should('be.enabled')
        cy.get('#numOfSims').should('be.enabled')
        cy.get('#runSim').should('be.enabled')

        cy.get('#sample-size').type('10')
        cy.get('#numOfSims').type('10000')
        cy.get('#runSim').click()

        cy.get('#MinMax').click()
        cy.get('#min-interValue').type('{backspace}0.55')
        cy.get('#max-interValue').type('{backspace}0.75')

        cy.get('#includeMin').click()
        cy.get('#includeMax').click()
        cy.wait(500)
    })

    it('Should reset input fields', () => {
        cy.get('#sample-size').should('be.disabled')
        cy.get('#numOfSims').should('be.disabled')
        cy.get('#runSim').should('be.disabled')

        cy.get('#success').type('60')
        cy.get('#failure').type('20')
        cy.get('.load-button').click()

        cy.get('#sample-size').should('be.enabled')
        cy.get('#numOfSims').should('be.enabled')
        cy.get('#runSim').should('be.enabled')

        cy.get('#sample-size').type('10')
        cy.get('#numOfSims').type('10000')
        cy.get('#runSim').click()

        cy.get('#MinMax').click()
        cy.get('#min-interValue').type('{backspace}0.55')
        cy.get('#max-interValue').type('{backspace}0.75')

        cy.get('.reset-button').click()
        cy.get('#sample-size').should('be.disabled')
        cy.get('#numOfSims').should('be.disabled')
        cy.get('#runSim').should('be.disabled')
    })

    it('should display error message if load button clicked with no inputs', () => {
        cy.contains('button', 'Load Data').click()
        cy.on('window:alert', (message) => {
            expect(message).to.equal('The value of successes and failures must be greater than 0')
        })
    })
})