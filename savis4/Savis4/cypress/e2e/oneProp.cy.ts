describe('template spec', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/oneproportion')
    })
    
    it('passes', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:4200/oneproportion')
        // cy.get('.form-incline > #forget').click()
    })

    it('should change the slider', () => {
        cy.get('#probabilitySlider')
        .invoke("val", 0.2)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 0.4)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 0.6)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 0.8)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 1)
        .trigger("change")
        .click({ force: true })
     
    })
    
    it('should change the number of tosses', () => {
        cy.get('#tossesInput').type('0')
    })

    it('should change the sample size', () => {
        cy.get('#sampleSize').type('0')
    })

    it('should draw the sample with different sample sizes', () => {
        cy.get('.mid > button').click()
        cy.wait(1000)
        cy.get('#sampleSize').type('0')
        cy.get('.mid > button').click()
        cy.wait(1000)
        cy.get('#sampleSize').type('0')
        cy.get('.mid > button').click()
        cy.wait(500)

    })
    it('should change the min and max head slider', () => {
        cy.get('#sampleSize').type('3')
        cy.get('.mid > button').click()
        cy.wait(1000)
        cy.get('#maxHeads')
        .invoke("val", 1)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 2)
        .trigger("change")
        .click({ force: true })
        .invoke("val",3)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 4)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 5)
        .trigger("change")
        .click({ force: true })
        cy.wait(1000)
        cy.get('#minHeads')
        .invoke("val", 1)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 2)
        .trigger("change")
        .click({ force: true })
        .invoke("val",3)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 4)
        .trigger("change")
        .click({ force: true })
        .invoke("val", 5)
        .trigger("change")
        .click({ force: true })
     
    })
    it('should click the reset button', () => {
        cy.window().then((win) => {
            cy.stub(win.console, 'log').as('consoleLog');
          });
        cy.get('.mid > button').click()
        cy.wait(500)
        cy.get('.top > button').click()
        cy.wait(500)
        cy.get('@consoleLog').should('have.been.calledWith', 'chart reset') 


    })

})